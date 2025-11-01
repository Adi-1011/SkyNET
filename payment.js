// Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
      method.addEventListener('click', function () {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    const cardDisplay = document.getElementById('cardDisplay');

    cardNumberInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
      e.target.value = formattedValue;

      if (value.length > 0) {
        let displayValue = value.split('').map((digit, index) => {
          return (index + 1) % 4 === 0 ? digit + ' ' : digit;
        }).join('');
        cardDisplay.textContent = displayValue || '**** **** **** ****';
      } else {
        cardDisplay.textContent = '**** **** **** ****';
      }
    });

    // Cardholder name display
    const cardNameInput = document.getElementById('cardName');
    const nameDisplay = document.getElementById('nameDisplay');

    cardNameInput.addEventListener('input', function (e) {
      nameDisplay.textContent = e.target.value.toUpperCase() || 'YOUR NAME';
    });

    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    const expiryDisplay = document.getElementById('expiryDisplay');

    expiryInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
      expiryDisplay.textContent = value || 'MM/YY';
    });

    // CVV input (numbers only)
    document.getElementById('cvv').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '');
    });

    // ZIP code input (numbers only)
    document.getElementById('zipCode').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Form validation
    const form = document.getElementById('paymentForm');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      // Reset all errors
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      // Validate card name
      const cardName = document.getElementById('cardName').value.trim();
      if (cardName.length < 3 || !/^[a-zA-Z\s]+$/.test(cardName)) {
        document.getElementById('cardName').parentElement.classList.add('error');
        isValid = false;
      }

      // Validate card number
      const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
      if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        document.getElementById('cardNumber').parentElement.classList.add('error');
        isValid = false;
      }

      // Validate expiry date
      const expiry = document.getElementById('expiryDate').value;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(expiry)) {
        document.getElementById('expiryDate').parentElement.classList.add('error');
        isValid = false;
      }

      // Validate CVV
      const cvv = document.getElementById('cvv').value;
      if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
        document.getElementById('cvv').parentElement.classList.add('error');
        isValid = false;
      }

      // Validate ZIP
      const zip = document.getElementById('zipCode').value;
      if (zip.length < 5 || !/^\d+$/.test(zip)) {
        document.getElementById('zipCode').parentElement.classList.add('error');
        isValid = false;
      }

      // Validate email
      const email = document.getElementById('email').value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('email').parentElement.classList.add('error');
        isValid = false;
      }

      // Validate phone
      const phone = document.getElementById('phone').value;
      if (phone.replace(/\D/g, '').length < 10) {
        document.getElementById('phone').parentElement.classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Here you would normally send data to server
        alert('Payment processed successfully! This is where you would integrate with your payment gateway.');
        // In production: window.location.href = 'confirmation.html';
      } else {
        alert('Please fix the errors in the form.');
      }
    });

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';