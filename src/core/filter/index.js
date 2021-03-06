export function formatDate(d) {
  const date = new Date(d);
  return [
    [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':')
  ].join(' ').replace(/(?=\b\d\b)/g, '0');
}

export function formatMobile(m) {
  const s = String(m);
  return !s ? '' : `${s.slice(0, 3)}${s.slice(3, -4).replace(/./g, '*')}${s.slice(-4)}`;
}

export function translatePermission(a) {
  switch (a) {
    case 'rich':
      return '土豪用户';
    case 'admin':
      return '管理员';
    case 'normal':
    default:
      return '一般用户';
  }
}
