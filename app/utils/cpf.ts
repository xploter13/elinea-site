export const normalizeCpf = (value: string): string => value.trim().replace(/[.\-\s]/g, '')

export function isValidCpf(value: string): boolean {
  const cpf = normalizeCpf(value)
  if (!/^[0-9]{11}$/.test(cpf) || /^([0-9])\1{10}$/.test(cpf)) return false
  for (let position = 9; position < 11; position++) {
    let sum = 0
    for (let index = 0; index < position; index++) sum += Number(cpf[index]) * (position + 1 - index)
    const remainder = (sum * 10) % 11
    if ((remainder === 10 ? 0 : remainder) !== Number(cpf[position])) return false
  }
  return true
}
