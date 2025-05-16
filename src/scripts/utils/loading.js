const LoadingIndicator = {
  show() {
    console.log("Loding Indicator")
    document.getElementById('loading-overlay').style.display = 'flex';
    
  },
  hide() {
    document.getElementById('loading-overlay').style.display = 'none';
  }
};

export default LoadingIndicator;