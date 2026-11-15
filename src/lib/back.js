const stack = []
export const pushBack = (fn) => { stack.push(fn); return () => { const i = stack.indexOf(fn); if (i >= 0) stack.splice(i, 1) } }
export const handleBack = () => { const f = stack.pop(); if (f) { f(); return true } return false }
