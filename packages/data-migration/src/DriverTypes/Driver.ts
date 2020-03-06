export default interface Driver<P, R> {
  init?: () => Promise<void>;
  cleanup?: () => Promise<void>;
  parameters: P;
  resource?: R;
}
