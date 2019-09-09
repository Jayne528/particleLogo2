$(document).ready(function () {

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext('2d');
  var img = document.getElementById("logo");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  var imgx = (canvasWidth - img.width) / 2;
  var imgy = (canvasHeight - img.height) / 2;

  //設定按鈕------------------------------------------------

  var playAnimation = true;

  var startButton = $("#startAnimation");
  var stopButton = $("#stopAnimation");

  startButton.hide();
  startButton.click(function() {
      $(this).hide();
      stopButton.show();

      playAnimation = true;
      animate();
  });

  stopButton.click(function() {
      $(this).hide();
      startButton.show();

      playAnimation = false;
  });



    var Particle = function (x, y, ex, ey, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.ex = ex;   //目标位置
        this.ey = ey;   //目标位置
        this.vx = vx;   //粒子的速度
        this.vy = vy;   //粒子的速度
        this.color = color;
        this.a = 1000;
        this.width = 2;    //每個粒子的寬
        this.height = 2;   //每個粒子的高

        this.maxCheckTimes = 50;  //確認粒子是靜止
        this.checkLength = 5;     //確認粒子是靜止
        this.checkTimes = 0;

    }
  
    var particleArray = new Array();

    context.drawImage(img, imgx, imgy, img.width, img.height);

    var imgData = context.getImageData(imgx, imgy, img.width, img.height);

    for (var r = 0; r < img.width; r++) {
        for (var c = 0; c < img.height; c++) {

            var pos = (c * imgData.width + r) * 4;

            var red = imgData.data[pos];
            var green = imgData.data[pos + 1];
            var blue = imgData.data[pos + 2];
            var alpha = imgData.data[pos + 3];

            if (alpha >= 125) {
                
                var color = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";

                var x_random = r + Math.random() * 20;
                var x = x_random + imgx;
                var ex = r + imgx;
                var vx = Math.random() * 200 + 400;

                var y_random = img.height / 2 - Math.random() * 40 + 20;
                var y = y_random + imgy;
                var ey = c + imgy;
                var vy = Math.random() * 300;

                particleArray.push( new Particle(x, y, ex, ey, vx, vy, color ))

            }
        }
    }

    var ite = 1000;
    var start = 0;
    var end = start + ite;

  function animate(){

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    var oldColor ;


    var tmpParticle1 = particleArray.slice(start, end);    
    end += ite;

    for (var i = 0; i<tmpParticle1.length; i++) {
        
        var tmpParticle = tmpParticle1[i];
        if (tmpParticle.stop) {
            tmpParticle.x = tmpParticle.ex;
            // 停止時畫出來
            if (oldColor != tmpParticle.color) {
                context.fillStyle = tmpParticle.color;
                oldColor = tmpParticle.color
            }

            context.fillRect(tmpParticle.x - tmpParticle.width / 2, tmpParticle.y - tmpParticle.height / 2, tmpParticle.width, tmpParticle.height);
            
        } else {
            time = 0.016;

            var dX = tmpParticle.ex - tmpParticle.x;
            var dY = tmpParticle.ey - tmpParticle.y;
            var angle = Math.atan2(dY, dX);
            var ax = Math.abs(tmpParticle.a * Math.cos(angle));
            ax = tmpParticle.x > tmpParticle.ex ? -ax : ax

            var ay = Math.abs(tmpParticle.a * Math.sin(angle));
            ay = tmpParticle.y > tmpParticle.ey ? -ay : ay;

            tmpParticle.vx += ax * time;
            tmpParticle.vy += ay * time;
            tmpParticle.vx *= 0.95;
            tmpParticle.vy *= 0.95;
            tmpParticle.x += tmpParticle.vx * time;
            tmpParticle.y += tmpParticle.vy * time;

            //確認粒子是否靜止
            if (Math.abs(tmpParticle.x - tmpParticle.ex) <= tmpParticle.checkLength && Math.abs(tmpParticle.y - tmpParticle.ey) <= tmpParticle.checkLength) {
                tmpParticle.checkTimes++;
                if (tmpParticle.checkTimes >= tmpParticle.maxCheckTimes) {
                tmpParticle.stop = true;
                }
            } else { 
                tmpParticle.checkTimes = 0;
            }

            // 動態移動時畫出來
            if (oldColor != tmpParticle.color) {
                context.fillStyle = tmpParticle.color;
                oldColor = tmpParticle.color
            }

            context.fillRect(tmpParticle.x - tmpParticle.width / 2, tmpParticle.y - tmpParticle.height / 2, tmpParticle.width, tmpParticle.height);
        }
    }

    if (playAnimation) {
        window.requestAnimationFrame(animate);
    }

  }

  animate();
 

});