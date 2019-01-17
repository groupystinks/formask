export default function onFilterChecklist(values, checked, checklist) {
  let newChecklist;
  if (checked) {
    newChecklist = [...checklist, values];
  } else {
    newChecklist = checklist.filter(checkbox => {
      if (Array.isArray(values)) {
        return !values.includes(checkbox);
      }
      return checkbox !== values;
    });
  }

  // flatten result one level deep
  return newChecklist.reduce((acc, val) => acc.concat(val), []);
}
