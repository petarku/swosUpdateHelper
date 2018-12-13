async function findMatchDataURLS(page, selector) {
    const rect = await page.evaluate(selector => {

		
	  const elements = document.querySelectorAll(selector) ;
	  	
	   
	  if (!elements) {
		return null ; 
	  } 
	  let arrayOfURLS=[]; 
	  for (var j = 0; j < elements.length; j++) {
		arrayOfURLS.push(elements[j].href)
	
		}
     
      return { urlElements : arrayOfURLS };
	}, selector);
	
	if (!rect) {
		console.log('Dom element couldnt be found ') ; 
		return null ; 
	}
	
	//console.log(rect[0].href); 
   return rect ; 
    
	
  }

async function findElement(page, selector) {
    const rect = await page.evaluate(selector => {

	  const element = document.querySelector(selector) ;
	  if (!element) {
		return null ; 
	  } 
     
      return { href: element.href };
	}, selector);
	
	if (!rect) {
		console.log('Dom element couldnt be found ') ; 
		return null ; 
	}
	
   return rect.href ; 
    
	
  }

async function screenshotDOMElement(page, selector, padding = 0, pathString) {
    const rect = await page.evaluate(selector => {

	  const element = document.querySelector(selector) ;
	  if (!element) {
		return null ; 
	  } 
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
	}, selector);
	
	if (!rect) {
		console.log('Dom element couldnt be found ') ; 
		return null ; 
	}
   // console.log('rect: ', rect);

    return await page.screenshot({
      path: pathString,
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      },
	});
	
  }

  
  module.exports = {
	screenshotDOMElement, findElement, findMatchDataURLS
};