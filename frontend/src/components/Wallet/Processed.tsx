import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Stack,
  Text
} from "@chakra-ui/react"
import { ProcessedRequest } from "declarations/b3_wallet/b3_wallet.did"
import { useMemo } from "react"
import Parent from "../Recursive"

interface ProcessedRequestProps extends ProcessedRequest {}

const Processed: React.FC<ProcessedRequestProps> = ({
  request,
  result,
  timestamp,
  status
}) => {
  const date = useMemo(() => {
    const time = timestamp / BigInt(1e6)
    return new Date(Number(time))
  }, [timestamp])

  console.log(result)

  const stt = Object.keys(status)[0]
  return (
    <AccordionItem
      bgColor={stt === "Success" ? "green.100" : "red.100"}
      border="none"
      _focus={{ boxShadow: "none" }}
    >
      <h2>
        <AccordionButton>
          <Stack
            flex="12"
            textAlign="left"
            direction="row"
            justify="space-between"
          >
            <Box flex="8" textAlign="left">
              {request.consent_message.method}
            </Box>
            <Box flex="4" textAlign="left">
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </Box>
          </Stack>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Text>
          <strong>Status:</strong> {stt}
        </Text>
        <Text>
          <strong>Message:</strong> {request.consent_message.message}
        </Text>
        <Text>
          <strong>Role:</strong> {Object.keys(request.role)[0]}
        </Text>
        <strong>Args:</strong>
        {Object.entries(request.consent_message).map(([key, value]) => (
          <Parent key={key} parent={key} child={value} />
        ))}
      </AccordionPanel>
    </AccordionItem>
  )
}

export default Processed
