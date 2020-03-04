export default interface Driver {
  init?: () => Promise<void>;
  cleanup?: () => Promise<void>;
}
