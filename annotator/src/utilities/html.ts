export const combineRects = (rect1: DOMRect, rect2: DOMRect): DOMRect => {
  const left = Math.min(rect1.left, rect2.left);
  const top = Math.min(rect1.top, rect2.top);
  const right = Math.max(rect1.right, rect2.right);
  const bottom = Math.max(rect1.bottom, rect2.bottom);
  const width = right - left;
  const height = bottom - top;
  return new DOMRect(left, top, width, height);
};

export const checkNodeFamilyAtDepth = (node: Node, depth: number, callback: (node: Node) => void) => {
  if (depth === 0) return callback(node);
  if (node.nextSibling) checkNodeFamilyAtDepth(node.nextSibling, depth - 1, callback);
  if (node.previousSibling) checkNodeFamilyAtDepth(node.previousSibling, depth - 1, callback);
  if (node.parentNode) checkNodeFamilyAtDepth(node.parentNode, depth - 1, callback);
  if (node.childNodes.length > 0) checkNodeFamilyAtDepth(node.childNodes[0], depth - 1, callback);
};

export const getCaratWordIndexWithinNestedDiv = (parentNode: Node) => {
  const selection = window.getSelection();

  let node = (selection?.anchorNode as Node) || (selection?.focusNode as Node);
  if (!node) return;

  const textBeforeSelection = getTextUpToNode(parentNode, node);
  const wordIndex =
    textBeforeSelection
      .split(" ")
      .map((word) => word.trim())
      .filter((word) => word).length - 1;
  return wordIndex > 0 ? wordIndex : 0;
};

export const pollForElementById = (elementId: string, maxAttempts: number, delayMs: number, callback: (element: HTMLElement) => void, errorCallback?: () => void) => {
  let attempts = 0;

  function checkElement() {
    const element = document.getElementById(elementId);

    if (element) {
      callback(element);
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(checkElement, delayMs);
    } else {
      errorCallback && errorCallback();
    }
  }

  checkElement();
};

export const pollForElementPromise = (elementId: string, maxAttempts: number, delayMs: number): Promise<HTMLElement> => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function checkElement() {
      const element = document.getElementById(elementId);

      if (element) {
        resolve(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkElement, delayMs);
      } else {
        reject(new Error(`Failed to find element with ID ${elementId} after ${maxAttempts} attempts`));
      }
    }

    checkElement();
  });
};

export const pollForElementBySelector = (selector: string, maxAttempts: number, delayMs: number, callback: (element: HTMLElement) => void, errorCallback?: () => void) => {
  let attempts = 0;

  function checkElement() {
    const element = document.querySelector(selector) as HTMLElement;

    if (element) {
      callback(element);
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(checkElement, delayMs);
    } else {
      errorCallback && errorCallback();
    }
  }

  checkElement();
};

export const walkUpToParentNodeWithIdPrefix = (node: Node | null, prefix: string): HTMLElement | null => {
  if (!node) return null;
  let el = node as HTMLElement;
  if (el.nodeName === "#text") return walkUpToParentNodeWithIdPrefix(el.parentNode, prefix);
  if (el.nodeName === "DIV" && el.id.startsWith(prefix)) return el;
  return walkUpToParentNodeWithIdPrefix(el.parentNode, prefix);
};

export const getTextUpToNode = (parent: Node, node: Node): string => {
  if (parent === node) return "";

  let text = "";
  const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
  let currentNode;
  while ((currentNode = walker.nextNode()) && currentNode !== node) {
    text += " " + currentNode.textContent || "";
  }
  return text;
};

export const findClosestItemToCaratById = (matchIds: string[]): HTMLElement | null => {
  try {
    const selection = window.getSelection();
    if (!selection) return null;

    const range = selection.getRangeAt(0);
    let node = range.startContainer as HTMLElement;

    if (!node.id || !matchIds.includes(node.id)) {
      checkNodeFamilyAtDepth(node, 2, (n) => {
        let thisnode = n as HTMLElement;
        if (thisnode.id && matchIds.includes(thisnode.id)) node = thisnode;
      });
    }

    return node as HTMLElement;
  } catch (error) {
    return null;
  }
};

export function getIdsRecursive(node: Node): string[] {
  const ids: string[] = [];

  function traverse(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).id) {
      ids.push((node as Element).id);
    }

    if (node.hasChildNodes()) {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        traverse(children[i]);
      }
    }
  }

  traverse(node);
  return ids;
}

export function getElementsRecursive(node: Node): Element[] {
  const els: Element[] = [];

  function traverse(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      els.push(node as Element);
    }

    if (node.hasChildNodes()) {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        traverse(children[i]);
      }
    }
  }

  traverse(node);
  return els;
}

export function getUniqueAttributeValuesInElements(elements: Element[], attributeKey: string) {
  return elements.reduce((acc: string[], el) => {
    const attr = el.getAttribute(attributeKey);
    if (attr && !acc.includes(attr)) acc.push(attr);
    return acc;
  }, []);
}
