/* Attaching a Shadow DOM */
let cardGulp = document.querySelector('#card-gulp');
let shadowGulp = cardGulp.attachShadow({
  mode: 'open' //shadow variable can be accessed from the parent DOM element. If closed, it can't be accessed
});
shadowGulp.innerHTML = `
    ${cardGulp.innerHTML}
    <style>
      @import "shadowCSS/card-skill.css";
      @import "shadowCSS/card-gulp.css";
    </style>
`;
cardGulp.innerHTML = null;//not to duplicate the content placed into shadow-root


let cardResp = document.querySelector('#card-resp');
let shadowResp = cardResp.attachShadow({
  mode: 'open' //shadow variable can be accessed from the parent DOM element. If closed, it can't be accessed
});
shadowResp.innerHTML = `
    ${cardResp.innerHTML}
    <style>
      @import "shadowCSS/card-skill.css";
      @import "shadowCSS/card-resp.css";
    </style>
`;
cardResp.innerHTML = null;//not to duplicate the content placed into shadow-root


let cardBrowser = document.querySelector('#card-browser');
let shadowBrowser = cardBrowser.attachShadow({
  mode: 'open' //shadow variable can be accessed from the parent DOM element. If closed, it can't be accessed
});
shadowBrowser.innerHTML = `
    ${cardBrowser.innerHTML}
    <style>
      @import "shadowCSS/card-skill.css";
      @import "shadowCSS/card-browser.css";
    </style>
`;
cardBrowser.innerHTML = null;//not to duplicate the content placed into shadow-root


let cardPixel = document.querySelector('#card-pixel');
let shadowPixel = cardPixel.attachShadow({
  mode: 'open' //shadow variable can be accessed from the parent DOM element. If closed, it can't be accessed
});
shadowPixel.innerHTML = `
    ${cardPixel.innerHTML}
    <style>
      @import "shadowCSS/card-skill.css";
      @import "shadowCSS/card-pixel.css";
    </style>
`;
cardPixel.innerHTML = null;//not to duplicate the content placed into shadow-root

/*
shadow.getElementById('p-elem');
shadow.querySelector('.green-p');
*/ //this is how you can access elements within a shadow-root