import { useFieldArray, useFormContext } from "react-hook-form"
import FieldRoute, { FieldRouteProps } from "./FieldRoute"
import { Switch } from "@src/components/ui/switch"
import { Box } from "@src/components/ui/box"
import { Label } from "@src/components/ui/label"

interface OptionalProps extends FieldRouteProps {}

const Optional: React.FC<OptionalProps> = ({
  methodField,
  registerName,
  errors,
  ...rest
}) => {
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: registerName as never
  })

  return (
    <Box className="my-2" {...rest}>
      <Box className="flex justify-between items-center">
        <Label className="flex-1 w-full block text-lg font-medium">
          {methodField.label.toTitleCase()}
        </Label>
        <Switch
          onClick={() => (fields.length === 0 ? append("") : remove(0))}
        />
      </Box>
      {fields.length > 0 && (
        <FieldRoute
          methodField={methodField.fields[0]}
          registerName={`${registerName}.[0]`}
          errors={errors?.[0 as never]}
        />
      )}
    </Box>
  )
}
export default Optional