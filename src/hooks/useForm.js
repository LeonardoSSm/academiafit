import { useState } from "react";

export default function useForm(initial = {}) {
  const [values, setValues] = useState(initial);
  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const reset = (next = initial) => setValues(next);
  return { values, onChange, reset, setValues };
}
