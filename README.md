# Tooltip-Balloon
Plugin for MaterializeCSS.com
## Usage
```html
  [...]
  <!-- Compiled and minified CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">
  <link rel="stylesheet" href="https://goisneto.com.br/assets/css/balloon.materializecss.css">

  <!-- Compiled and minified JavaScript -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js"></script>
  <script src="https://goisneto.com.br/assets/js/balloon.materializecss.min.js"></script>
  [...]
  <!--
  Can pass options in HTML or JS
  <a data-balloon="Some text to show..." data-position="bottom" data-html="false" data-delay="50" href="#!" class="ballooned btn">Im a balloon button.</a>
  -->
  <a data-position="bottom" data-html="true" data-delay="50" href="#!" class="ballooned btn">Im a balloon button.</a>
  [...]
```
```javascript
  $(document).ready(function() {
    $(".ballooned").balloon({
      //Can pass options in HTML or JS
      balloon: '<strong>Some text to show...</strong>', //Inner Balloon Text or HTML
      delay: 350, //Animation Show Time
      position: 'bottom', //Display Position
      html: true //Render HTML
    });
  });
```
[Sample (jsfiddle)](https://fiddle.jshell.net/goisneto/eetmuoea/)
