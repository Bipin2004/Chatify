import { useEffect, useRef } from 'react';

export const useAutoResize = (value) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [value]);

  return textareaRef;
};

export default useAutoResize;
