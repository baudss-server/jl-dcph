// Kunin ang gallery grid container
const galleryGrid = document.getElementById('gallery-grid');

// Base64-encoded blank 1x1 transparent GIF
const blankImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// Array para sa mga image URL ng gallery
// Dito mo palitan ang mga blankImage variable ng mga actual na path/URL ng iyong larawan
// Hal. '.../images/va-image1.jpg'
const galleryImages = [
  '../images/appoint.png',
  '../images/cm.png',
  '../images/cs.png',
  '../images/de.png',
  '../images/dp.png',
  '../images/sma.png'
];

// I-loop ang array at mag-generate ng HTML
galleryImages.forEach(imageUrl => {
  const galleryItem = document.createElement('div');
  galleryItem.classList.add('dcp-gallery-item', 'glass');
  
  const imgElement = document.createElement('img');
  imgElement.src = imageUrl;
  imgElement.alt = 'Virtual Assistant at work';
  
  galleryItem.appendChild(imgElement);
  galleryGrid.appendChild(galleryItem);
});