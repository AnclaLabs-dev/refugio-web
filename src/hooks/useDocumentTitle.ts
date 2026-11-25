import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title.includes("Refugio") ? title : `${title} | Refugio`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
