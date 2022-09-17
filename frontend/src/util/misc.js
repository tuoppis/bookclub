export async function confirmAction(questionStr, actionFn, resolveStr, rejectStr) {
  if (window.confirm(questionStr)) {
    try {
      actionFn();
      return resolveStr;
    } catch (err) {
      return rejectStr;
    }
  }
  return "";
}
