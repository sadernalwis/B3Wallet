import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AccountsStatus {
  'stag_counter' : bigint,
  'prod_counter' : bigint,
  'dev_counter' : bigint,
}
export type BitcoinNetwork = { 'Mainnet' : null } |
  { 'Regtest' : null } |
  { 'Testnet' : null };
export interface CanisterStatus {
  'canister_id' : Principal,
  'status_at' : bigint,
  'version' : string,
  'canister_status' : CanisterStatusResponse,
  'account_counter' : bigint,
}
export interface CanisterStatusResponse {
  'status' : CanisterStatusType,
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : DefiniteCanisterSettings,
  'idle_cycles_burned_per_day' : bigint,
  'module_hash' : [] | [Uint8Array | number[]],
}
export type CanisterStatusType = { 'stopped' : null } |
  { 'stopping' : null } |
  { 'running' : null };
export interface DefiniteCanisterSettings {
  'freezing_threshold' : bigint,
  'controllers' : Array<Principal>,
  'memory_allocation' : bigint,
  'compute_allocation' : bigint,
}
export type Environment = { 'Production' : null } |
  { 'Development' : null } |
  { 'Staging' : null };
export interface EvmSignRequest {
  'transaction' : EvmTransaction,
  'deadline' : bigint,
  'chain_id' : bigint,
  'message' : Uint8Array | number[],
}
export interface EvmTransaction {
  'r' : string,
  's' : string,
  'v' : string,
  'to' : string,
  'transaction_type' : EvmTransactionType,
  'value' : bigint,
  'max_priority_fee_per_gas' : [] | [bigint],
  'data' : string,
  'max_fee_per_gas' : [] | [bigint],
  'chain_id' : bigint,
  'nonce' : bigint,
  'gas_limit' : bigint,
  'access_list' : [] | [Array<[string, Array<string>]>],
  'gas_price' : [] | [bigint],
}
export type EvmTransactionType = { 'EIP1559' : null } |
  { 'EIP2930' : null } |
  { 'Legacy' : null };
export interface Ledger {
  'subaccount' : Uint8Array | number[],
  'public_keys' : PublicKeys,
}
export type Network = { 'BTC' : BitcoinNetwork } |
  { 'EVM' : bigint } |
  { 'ICP' : null } |
  { 'SNS' : string };
export interface PublicKeys {
  'ecdsa' : [] | [Uint8Array | number[]],
  'addresses' : Array<[string, string]>,
  'identifier' : Uint8Array | number[],
}
export interface SignedTransaction {
  'data' : Uint8Array | number[],
  'timestamp' : bigint,
}
export interface SignerAccount {
  'id' : string,
  'name' : string,
  'hidden' : boolean,
  'ledger' : Ledger,
  'canisters' : Array<[Principal, SignerAllowance]>,
  'requests' : Array<[Principal, EvmSignRequest]>,
  'signed' : SignedTransaction,
}
export interface SignerAllowance {
  'updated_at' : bigint,
  'metadata' : Array<[string, string]>,
  'created_at' : bigint,
  'limit' : [] | [number],
  'expires_at' : [] | [bigint],
}
export interface SignerAllowanceArgs {
  'metadata' : Array<[string, string]>,
  'limit' : [] | [number],
  'expires_at' : [] | [bigint],
}
export interface State {
  'stag_counter' : bigint,
  'metadata' : Array<[string, string]>,
  'prod_counter' : bigint,
  'accounts' : Array<[string, SignerAccount]>,
  'dev_counter' : bigint,
}
export interface Tokens { 'e8s' : bigint }
export interface _SERVICE {
  'account_status' : ActorMethod<[], AccountsStatus>,
  'change_owner' : ActorMethod<[Principal], Principal>,
  'create_account' : ActorMethod<
    [[] | [Environment], [] | [string]],
    SignerAccount
  >,
  'generate_address' : ActorMethod<[string, Network], string>,
  'get_account' : ActorMethod<[string], SignerAccount>,
  'get_account_count' : ActorMethod<[], bigint>,
  'get_accounts' : ActorMethod<[], Array<SignerAccount>>,
  'get_addresses' : ActorMethod<[string], Array<[string, string]>>,
  'get_connected_canisters' : ActorMethod<
    [string],
    Array<[Principal, SignerAllowance]>
  >,
  'get_owner' : ActorMethod<[], Principal>,
  'get_sign_requests' : ActorMethod<[string, Principal], EvmSignRequest>,
  'get_signed_transaction' : ActorMethod<[string], SignedTransaction>,
  'hide_account' : ActorMethod<[string], undefined>,
  'load_wasm' : ActorMethod<[Uint8Array | number[]], bigint>,
  'reintall_canister' : ActorMethod<[], undefined>,
  'remove_account' : ActorMethod<[string], undefined>,
  'rename_account' : ActorMethod<[string, string], string>,
  'request_allowance' : ActorMethod<
    [string, Principal, SignerAllowanceArgs],
    undefined
  >,
  'request_balance' : ActorMethod<[string], Tokens>,
  'request_public_key' : ActorMethod<[string], Uint8Array | number[]>,
  'request_sign_message' : ActorMethod<
    [string, Uint8Array | number[]],
    Uint8Array | number[]
  >,
  'request_sign_transaction' : ActorMethod<
    [string, Uint8Array | number[], bigint],
    SignedTransaction
  >,
  'reset_accounts' : ActorMethod<[], State>,
  'send_icp' : ActorMethod<
    [string, string, Tokens, [] | [Tokens], [] | [bigint]],
    bigint
  >,
  'status' : ActorMethod<[], CanisterStatus>,
  'top_up_and_notify' : ActorMethod<
    [string, Tokens, [] | [Principal], [] | [Tokens]],
    bigint
  >,
  'unload_wasm' : ActorMethod<[], bigint>,
  'update_canister_controllers' : ActorMethod<[Array<Principal>], undefined>,
  'upgrade_canister' : ActorMethod<[], undefined>,
  'version' : ActorMethod<[], string>,
  'wasm_hash' : ActorMethod<[], Uint8Array | number[]>,
}