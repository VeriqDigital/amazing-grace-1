type HoneypotFieldProps = {
  id: string;
};

const HoneypotField = ({ id }: HoneypotFieldProps) => (
  <div
    className="absolute left-[-10000px] h-px w-px overflow-hidden"
    aria-hidden="true"
  >
    <label htmlFor={id}>Company</label>
    <input id={id} name="company" type="text" tabIndex={-1} autoComplete="off" />
  </div>
);

export default HoneypotField;
