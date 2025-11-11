export const onlyDigits = (value = "") => value.replace(/\D/g, "");

export const maskCPF = (value = "") =>
  onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export const maskCEP = (value = "") =>
  onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");

export const validateNome = (value) => value.trim().length >= 3;

export const validateCEP = (value) => onlyDigits(value).length === 8;

export const validateCPF = (value) => {
  const digits = onlyDigits(value);
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  const calc = (slice) => {
    let sum = 0;
    for (let i = 0; i < slice; i += 1) {
      sum += Number(digits[i]) * (slice + 1 - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  return calc(9) === Number(digits[9]) && calc(10) === Number(digits[10]);
};
