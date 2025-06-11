fetch("https://script.google.com/macros/s/SEU_SCRIPT_URL/exec")
  .then(res => res.json())
  .then(data => console.log(data));
