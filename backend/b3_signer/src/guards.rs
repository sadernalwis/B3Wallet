use b3_helper::{
    b3_revert,
    types::{ControllerId, SignerId},
};
use b3_signer_lib::{
    error::SignerError,
    signer::Roles,
    signer::SignerUser,
    store::{check_signer, with_signers, with_signers_mut},
    types::SignerUsers,
};
use candid::candid_method;
use ic_cdk::{
    api::management_canister::{
        main::{update_settings, UpdateSettingsArgument},
        provisional::CanisterSettings,
    },
    query, update,
};

pub fn caller_is_owner() -> Result<(), String> {
    let caller_id = ic_cdk::caller();

    check_signer(caller_id, Some(Roles::Owner))
}

pub fn caller_is_admin() -> Result<(), String> {
    let caller_id = ic_cdk::caller();

    check_signer(caller_id, Some(Roles::Admin))
}

pub fn caller_is_operator() -> Result<(), String> {
    let caller_id = ic_cdk::caller();

    check_signer(caller_id, Some(Roles::Operator))
}

pub fn caller_is_signer() -> Result<(), String> {
    let caller_id = ic_cdk::caller();

    check_signer(caller_id, None)
}

#[query]
#[candid_method(query)]
pub fn get_signers() -> SignerUsers {
    with_signers(|u| u.clone())
}

// #[update(guard = "caller_is_signer")]
// #[candid_method(update)]
pub fn add_signer(signer_id: SignerId, role: Roles) -> SignerUsers {
    let signer = SignerUser::from(role);

    with_signers_mut(|u| {
        u.insert(signer_id.clone(), signer);

        u.clone()
    })
}

#[update(guard = "caller_is_signer")]
#[candid_method(update)]
pub fn remove_signer(signer_id: SignerId) -> SignerUsers {
    with_signers_mut(|u| {
        u.remove(&signer_id);

        u.clone()
    })
}

#[candid_method(update)]
#[update(guard = "caller_is_signer")]
pub async fn update_canister_controllers(mut controllers: Vec<ControllerId>) -> () {
    let canister_id = ic_cdk::id();

    if !controllers.contains(&canister_id) {
        controllers.push(canister_id);
    }

    let arg = UpdateSettingsArgument {
        canister_id,
        settings: CanisterSettings {
            controllers: Some(controllers),
            compute_allocation: None,
            memory_allocation: None,
            freezing_threshold: None,
        },
    };

    update_settings(arg)
        .await
        .map_err(|err| SignerError::UpdateSettingsError(err.1))
        .unwrap_or_else(|err| b3_revert(err));
}
