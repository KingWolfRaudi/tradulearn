$(() => {
    const LAYER_COUNT = 12;
    const TRANSITION_DURATION = 1;
    const TRANSITION_DELAY = 0.85;

    const $target = $('[thanos-dissolve]');
    const target = $target[0];

    const $effect = $('[thanos-effect]');

    const hideTarget = () => {
        $target.css({
            'transition': `opacity ${TRANSITION_DURATION} ease`,
            opacity: 0
        });
        delay(1e3 * TRANSITION_DURATION).then(() => {
            $target.css('visibility', 'hidden');
        });
    };

    const showTarget = () => {
        $target.css({
            opacity: 1,
            visibility: 'visible'
        });
    };

    const showEffect = () => {
        $effect.css({
            display: 'block'
        });
    };

    const hideEffect = () => {
        $effect.css({
            display: 'none'
        });
    };

    const lockScroll = () => {
        $('html').css({
            overflow: 'hidden'
        });
        $('body').css({
            overflow: 'hidden'
        });
    };

    const unlockScroll = () => {
        $('html').css({
            overflow: 'initial'
        });
        $('body').css({
            overflow: 'initial'
        });
    };


    // bind event
    $target.on('click', function () {
        play();
    });

    // preload
    let canvas, effectImgDatas = [], $canvases = [];
    html2canvas(target, {
        backgroundColor: null,
    })
        .then(cnv => {
            canvas = cnv;
            const layerCount = LAYER_COUNT;

            const context = canvas.getContext('2d');
            const { width, height } = canvas;

            // get element imageData
            const imgData = context.getImageData(0, 0, width, height);

            // init empty imageData
            for (let i = 0; i < layerCount; i++) {
                effectImgDatas.push(context.createImageData(width, height));
            }
            sampler(effectImgDatas, imgData, width, height, layerCount);

            // create cloned canvases
            for (let i = 0; i < layerCount; i++) {
                const canvasClone = canvas.cloneNode();
                canvasClone.getContext('2d').putImageData(effectImgDatas[i], 0, 0);

                const $canvas = $(canvasClone);
                const transitionDelay = TRANSITION_DELAY * (i / layerCount);
                $canvas.css('transition-delay', `${transitionDelay}s`);

                hideEffect();
                $effect.append($canvas);

                $canvases.push($canvas);
            }
        });

    function play() {
        showTarget();
        showEffect();
        lockScroll();

        const bRect = target.getBoundingClientRect();
        $effect.css({
            left: bRect.left,
            top: bRect.top,
            width: bRect.width,
            height: bRect.height
        });

        // run transition on cloned canvases
        for (let $canvas of $canvases) {
            delay(0)
                .then(() => {
                    const rotate1 = 15 * (Math.random() - .5);
                    const rotate2 = 15 * (Math.random() - .5);
                    const fac = 2 * Math.PI * (Math.random() - .5);
                    const translateX = 60 * Math.cos(fac);
                    const translateY = 30 * Math.sin(fac);

                    $canvas.css({
                        transform: `rotate(${rotate1}deg) translate(${translateX}px, ${translateY}px) rotate(${rotate2}deg)`,
                        opacity: 0
                    });

                    const removeDelay = 1e3 * (TRANSITION_DURATION + 1 + Math.random());
                    delay(removeDelay)
                        .then(() => {
                            $canvas.remove();
                            $effect.remove();
                            unlockScroll();
                        });
                });

            hideTarget();
        }

    }

    function sampler(imgDatas, sourceImgData, width, height, layerCount) {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                for (let l = 0; l < 2; l++) {
                    // random piece index which tend to grow with x
                    const pieceIndex = Math.floor(layerCount * (Math.random() + 2 * x / width) / 3);
                    const pixelPos = 4 * (y * width + x);
                    for (let rgbaIndex = 0; rgbaIndex < 4; rgbaIndex++) {
                        const dataPos = pixelPos + rgbaIndex;
                        imgDatas[pieceIndex].data[dataPos] = sourceImgData.data[dataPos];
                    }
                }
            }
        }
    }

    function delay(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, ms);
        })
    }
});