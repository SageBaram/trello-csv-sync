export function getLabelIdsByNames(labels, labelNames) {
	if (!labelNames) return [];
  // Split the label names by comma and trim any whitespace
  const labelNameList = labelNames.split(",").map((name) => name.trim());

  // For each label name, find the corresponding label ID
  const labelIds = labelNameList
    .map((name) => {
      const label = labels.find(
        (lbl) => lbl.name.toLowerCase() === name.toLowerCase(),
      );
      return label ? label.id : null;
    })
    .filter((id) => id !== null); // Filter out any null values

  return labelIds;
}
