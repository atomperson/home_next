
document.addEventListener('DOMContentLoaded', function() {
  var keyList = ['name', 'company', 'phone_wechat', 'consulting_topic', 'content']

  var xhr = new XMLHttpRequest();
  xhr.timeout = 3000;
  xhr.ontimeout = function (event) {
    alert("请求超时！");
  }

  keyList.forEach(function(elKey) {
    function handle(e) {
      if(e.target.classList.contains('error')) {
        if(e.target.value.trim()) {
          e.target.classList.remove('error')
        }
      }
    }

    document.getElementById(elKey).addEventListener('input', handle)
    document.getElementById(elKey).addEventListener('change', handle)
  })

  Array.from(document.querySelectorAll('.footer-content > ul > li > span')).forEach(el => {
    el.addEventListener('click', function() {
      if(document.documentElement.clientWidth < 600) {
        var arrow = el.querySelector('i')
        var ulEl = el.parentNode.querySelector('span + ul')
        if(arrow.classList.contains('active')) {
          arrow.classList.remove('active')
          ulEl.classList.remove('active')
        } else {
          arrow.classList.add('active')
          ulEl.classList.add('active')
        }
      }
    })
  })

  document.getElementById('submit').addEventListener('click', function(e) {
    var status = false
    var data = keyList.reduce(function(result, key) {
      var el = document.getElementById(key)
      var text = el.value.trim()
      if(!text) {
        status = true
        el.classList.add('error')
      }
      result[key] = text
      return result
    }, {})

    if(!status) {
      e.target.disabled = true
      xhr.open('POST', 'https://api.zlusu.com/message/add');
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.onreadystatechange = function () {
        e.target.disabled = false
        if (xhr.readyState == 4 && xhr.status == 200) {
          var res = JSON.parse(xhr.responseText)
          var tipEl = document.getElementById('tip')
          if(Number(res.code) === 200) {
            tipEl.className = tipEl.className + ' show one'
            document.getElementById('tip-text').innerHTML = '提交成功'
            setTimeout(() => {
              tipEl.style.cssText = 'transform: translate(-50%, 0)'
            }, 10)

            keyList.forEach(function(elKey) {
              document.getElementById(elKey).value = ''
            })

            setTimeout(() => {
              tipEl.style.cssText = 'transform: translate(-50%, -110px)'

              setTimeout(() => {
                tipEl.className = 'tip'
              }, 500)
            }, 2000)
          } else {
            tipEl.className = tipEl.className + ' show two'
            document.getElementById('tip-text').innerHTML = res.msg
            setTimeout(() => {
              tipEl.style.cssText = 'transform: translate(-50%, 0)'
            }, 10)

            setTimeout(() => {
              tipEl.style.cssText = 'transform: translate(-50%, -110px)'

              setTimeout(() => {
                tipEl.className = 'tip'
              }, 500)
            }, 2000)
          }
        }
      }
      xhr.send(JSON.stringify(data));
    }
  })
})