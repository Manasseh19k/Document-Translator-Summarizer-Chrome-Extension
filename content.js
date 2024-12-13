chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getReviews') {
        // Extract reviews from the page. This will vary based on the page's structure.
        const reviews = getProductReviews();
        sendResponse({ reviews });
    }
});

// Function to extract reviews from the page (example for Amazon and other e-commerce platforms)
function getProductReviews() {
    let reviews = '';
    
    // Detect which website is being visited
    const site = getSiteName();

    // Extract reviews based on the site
    if (site === 'amazon') {
        reviews = getAmazonReviews();
    } else if (site === 'ebay') {
        reviews = getEbayReviews();
    } else {
        reviews = 'No reviews found for this website.';
    }

    // Return the extracted reviews
    return reviews.trim();
}

// Function to determine the site (this can be based on the URL or other criteria)
function getSiteName() {
    const url = window.location.hostname;

    if (url.includes('amazon')) {
        return 'amazon';
    } else if (url.includes('ebay')) {
        return 'ebay';
    } else {
        return 'unknown';
    }
}

// Function to extract reviews from Amazon
function getAmazonReviews() {
    let reviews = '';
    
    // Example selector for Amazon reviews
    const reviewElements = document.querySelectorAll('.review-text-content span');

    reviewElements.forEach((reviewElement) => {
        reviews += reviewElement.innerText.trim() + '\n\n';
    });

    return reviews;
}

// Function to extract reviews from eBay
function getEbayReviews() {
    let reviews = '';

    // Example selector for eBay reviews
    const reviewElements = document.querySelectorAll('.d-item-reviews span');

    reviewElements.forEach((reviewElement) => {
        reviews += reviewElement.innerText.trim() + '\n\n';
    });

    return reviews;
}
