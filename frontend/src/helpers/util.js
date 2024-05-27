export const domParserFn = (htmlString) => {

    // Parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // Extract text content from the <pre> element
    const preElement = doc.querySelector('pre');
    const preText = preElement.textContent;
    return preText
}


