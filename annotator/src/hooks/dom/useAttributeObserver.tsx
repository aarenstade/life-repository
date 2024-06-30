import { useEffect, useRef, useState } from "react";

function useAttributeObserver(attributeNames: string[]) {
  const ref = useRef<any>(null);
  const [attributeValues, setAttributeValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      setAttributeValues((prevValues) => {
        let newValues = { ...prevValues };

        for (let mutation of mutationsList) {
          if (mutation.type === "attributes" && mutation.attributeName && attributeNames.includes(mutation.attributeName || "")) {
            const attributeValue = ref.current?.getAttribute(mutation.attributeName);
            if (attributeValue) newValues[mutation.attributeName] = attributeValue;
          }
        }

        return newValues;
      });
    });

    if (ref.current) {
      observer.observe(ref.current, { attributes: true });
    }

    return () => observer.disconnect();
  }, [attributeNames]);

  return { ref, values: attributeValues };
}

export default useAttributeObserver;
