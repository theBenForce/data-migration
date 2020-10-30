export default interface Driver<P, R> {
  init: (parameters: P) => Promise<void>;
  cleanup?: () => Promise<void>;
  parameters: P;
  resource?: R;
}
