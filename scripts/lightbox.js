(function() {
    'use strict';

    var lightboxOverlay = null;
    var lightboxImage = null;
    var lightboxCaption = null;
    var closeButton = null;
    var prevButton = null;
    var nextButton = null;
    var galleryImages = [];
    var currentIndex = 0;
    var triggerElement = null;
    var touchStartX = 0;
    var touchEndX = 0;

    function createLightbox() {
        if (lightboxOverlay) return;

        lightboxOverlay = document.createElement('div');
        lightboxOverlay.className = 'lightbox-overlay';
        lightboxOverlay.setAttribute('role', 'dialog');
        lightboxOverlay.setAttribute('aria-modal', 'true');
        lightboxOverlay.setAttribute('aria-label', 'Image lightbox');
        lightboxOverlay.innerHTML = [
            '<div class="lightbox-content">',
            '  <button class="lightbox-close" aria-label="Close lightbox">&times;</button>',
            '  <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>',
            '  <div class="lightbox-image-container">',
            '    <img class="lightbox-image" src="" alt="">',
            '  </div>',
            '  <button class="lightbox-next" aria-label="Next image">&#10095;</button>',
            '  <div class="lightbox-caption" aria-live="polite"></div>',
            '</div>'
        ].join('\n');

        document.body.appendChild(lightboxOverlay);

        lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
        lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption');
        closeButton = lightboxOverlay.querySelector('.lightbox-close');
        prevButton = lightboxOverlay.querySelector('.lightbox-prev');
        nextButton = lightboxOverlay.querySelector('.lightbox-next');

        closeButton.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrevImage);
        nextButton.addEventListener('click', showNextImage);

        lightboxOverlay.addEventListener('click', function(e) {
            var isBackdrop = e.target === lightboxOverlay || 
                             e.target.classList.contains('lightbox-content') ||
                             e.target.classList.contains('lightbox-image-container');
            var isImage = e.target.classList.contains('lightbox-image');
            var isButton = e.target.tagName === 'BUTTON';
            
            if (isBackdrop && !isImage && !isButton) {
                closeLightbox();
            }
        });

        lightboxOverlay.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxOverlay.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        var swipeThreshold = 50;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNextImage();
            } else {
                showPrevImage();
            }
        }
    }

    function openLightbox(images, index, trigger) {
        createLightbox();
        galleryImages = images;
        currentIndex = index;
        triggerElement = trigger;
        updateImage();
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateNavButtons();
        closeButton.focus();
        document.addEventListener('keydown', handleKeydown);
    }

    function closeLightbox() {
        if (!lightboxOverlay) return;
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
        if (triggerElement) {
            triggerElement.focus();
            triggerElement = null;
        }
    }

    function updateImage() {
        var imgData = galleryImages[currentIndex];
        lightboxImage.src = imgData.src;
        lightboxImage.alt = imgData.alt || '';
        lightboxCaption.textContent = imgData.alt || '';
        updateNavButtons();
    }

    function updateNavButtons() {
        if (galleryImages.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = '';
            nextButton.style.display = '';
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === galleryImages.length - 1;
        }
    }

    function showPrevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            updateImage();
        }
    }

    function showNextImage() {
        if (currentIndex < galleryImages.length - 1) {
            currentIndex++;
            updateImage();
        }
    }

    function handleKeydown(e) {
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }

    function initGallery(container) {
        var images = container.querySelectorAll('img');
        var imageDataList = [];

        images.forEach(function(img, idx) {
            imageDataList.push({
                src: img.src,
                alt: img.alt
            });

            var wrapper = document.createElement('a');
            wrapper.href = img.src;
            wrapper.className = 'lightbox-trigger';
            wrapper.setAttribute('role', 'button');
            wrapper.setAttribute('aria-label', 'View larger: ' + (img.alt || 'Image'));
            wrapper.setAttribute('tabindex', '0');
            
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);

            wrapper.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(imageDataList, idx, wrapper);
            });

            wrapper.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(imageDataList, idx, wrapper);
                }
            });
        });
    }

    function initProductPreview(container) {
        var mainPreview = container.querySelector('#main-preview');
        var thumbnails = container.querySelectorAll('.preview-thumbnails img');
        
        if (!mainPreview || thumbnails.length === 0) return;

        function getImageDataList() {
            var list = [];
            thumbnails.forEach(function(thumb) {
                list.push({
                    src: thumb.src,
                    alt: thumb.alt
                });
            });
            return list;
        }

        var mainWrapper = document.createElement('a');
        mainWrapper.href = mainPreview.src;
        mainWrapper.className = 'lightbox-trigger';
        mainWrapper.setAttribute('role', 'button');
        mainWrapper.setAttribute('aria-label', 'View larger: ' + (mainPreview.alt || 'Product preview'));
        mainWrapper.setAttribute('tabindex', '0');
        
        mainPreview.parentNode.insertBefore(mainWrapper, mainPreview);
        mainWrapper.appendChild(mainPreview);

        function openFromMain(e) {
            e.preventDefault();
            var imageDataList = getImageDataList();
            var currentSrc = mainPreview.src;
            var idx = 0;
            for (var i = 0; i < imageDataList.length; i++) {
                if (imageDataList[i].src === currentSrc) {
                    idx = i;
                    break;
                }
            }
            openLightbox(imageDataList, idx, mainWrapper);
        }

        mainWrapper.addEventListener('click', openFromMain);
        mainWrapper.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                openFromMain(e);
            }
        });

        thumbnails.forEach(function(thumb) {
            thumb.style.cursor = 'pointer';
            thumb.setAttribute('tabindex', '0');
            thumb.setAttribute('role', 'button');
            thumb.setAttribute('aria-label', 'Select preview: ' + (thumb.alt || 'Thumbnail'));
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        var previewGallery = document.querySelector('.preview-gallery');
        if (previewGallery) {
            initGallery(previewGallery);
        }

        var productPreview = document.querySelector('.product-preview');
        if (productPreview) {
            initProductPreview(productPreview);
        }
    });
})();
