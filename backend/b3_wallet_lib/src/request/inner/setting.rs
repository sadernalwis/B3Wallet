use b3_helper::types::{CanisterId, Wasm, WasmHash, WasmHashString, WasmVersion};
use ic_cdk::{
    api::management_canister::{
        main::{
            install_code, update_settings, CanisterInstallMode, InstallCodeArgument,
            UpdateSettingsArgument,
        },
        provisional::CanisterSettings,
    },
    export::{candid::CandidType, serde::Deserialize},
};

use crate::{error::WalletError, request::Request, store::with_wasm, types::SignedMessage};

use super::InnerRequest;

// UPDATE SETTINGS - START
#[derive(CandidType, Clone, Deserialize, Debug, PartialEq)]
pub struct UpdateCanisterSettingsRequest {
    pub canister_id: CanisterId,
    pub settings: CanisterSettings,
}

impl From<&UpdateCanisterSettingsRequest> for UpdateSettingsArgument {
    fn from(args: &UpdateCanisterSettingsRequest) -> Self {
        UpdateSettingsArgument {
            canister_id: args.canister_id,
            settings: args.settings.clone(),
        }
    }
}

impl From<UpdateCanisterSettingsRequest> for Request {
    fn from(args: UpdateCanisterSettingsRequest) -> Self {
        InnerRequest::UpdateCanisterSettingsRequest(args).into()
    }
}

impl UpdateCanisterSettingsRequest {
    pub async fn execute(&self) -> Result<SignedMessage, WalletError> {
        update_settings(self.into())
            .await
            .map_err(|err| WalletError::UpdateSettingsError(err.1))?;

        Ok(SignedMessage::default())
    }

    pub fn validate_request(&self) -> Result<(), WalletError> {
        let canister_id = ic_cdk::id();

        // first check the controller is passed and then check if the controller is in the list of controllers
        if let Some(controller) = self.settings.controllers.as_ref() {
            if !controller.contains(&canister_id) {
                return Err(WalletError::InvalidController);
            }
        }

        Ok(())
    }
}

// UPDATE SETTINGS - END

// UPGRADE CANISTER - START
#[derive(CandidType, Clone, Deserialize, Debug, PartialEq)]
pub struct UpgradeCanisterRequest {
    pub wasm_hash: WasmHash,
    pub wasm_version: WasmVersion,
    pub wasm_hash_string: WasmHashString,
}

impl UpgradeCanisterRequest {
    pub fn new(wasm: Wasm, wasm_version: WasmVersion) -> Self {
        UpgradeCanisterRequest {
            wasm_version,
            wasm_hash: wasm.generate_hash(),
            wasm_hash_string: wasm.generate_hash_string(),
        }
    }
}

impl From<UpgradeCanisterRequest> for Request {
    fn from(args: UpgradeCanisterRequest) -> Self {
        InnerRequest::UpgradeCanisterRequest(args).into()
    }
}

impl UpgradeCanisterRequest {
    pub async fn execute(&self) -> Result<SignedMessage, WalletError> {
        let canister_id = ic_cdk::id();
        let wasm_module = with_wasm(|w| w.get());

        let args = InstallCodeArgument {
            canister_id,
            wasm_module,
            arg: Vec::new(),
            mode: CanisterInstallMode::Upgrade,
        };

        install_code(args).await.unwrap();

        Ok(SignedMessage::default())
    }
}