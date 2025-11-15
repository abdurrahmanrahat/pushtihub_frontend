// format date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Function to format text from HTML to plain text
export const stripHtml = (html: string): string => {
  if (!html) return "";

  // Remove all tags safely
  const text = html.replace(/<[^>]*>/g, "");

  // Decode common HTML entities (optional)
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

// Function to truncate text to a specified length
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + "...";
};
