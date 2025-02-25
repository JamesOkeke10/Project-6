$(document).ready(function () {
    // Check if user is logged in on the homepage (index.html)
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Hide login link, show logout button
        $('#login-link').hide();
        $('#login-btn').hide();
        $('#logout').show();

        // Handle Logout
        $('#logout').click(function (e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            localStorage.removeItem('email');
            alert("You have logged out.");
            window.location.href = 'login.html'; // Redirect to login page
        });
    } else {
        // Show login link if user is not logged in
        $('#login-link').show();
        $('#login-btn').show();
        $('#logout').hide();
    }

    // Purchase Modal Handling
    const purchaseModal = $('#purchase-modal');
    const closeBtn = $('.close-btn');
    const purchaseForm = $('#purchase-form');
    const ticketType = $('#ticket-type');
    const quantityInput = $('#quantity');
    const totalAmount = $('#total-amount');
    const phoneInput = $('#phone');
    const emailInput = $('#email');

    // Open purchase modal
    $('.purchase-btn').on('click', function () {
        const eventName = $(this).data('event');
        $('#event-name').val(eventName); // Set event name dynamically (if applicable)
        purchaseModal.show();
    });

    // Close modal
    closeBtn.on('click', function () {
        purchaseModal.hide();
    });

    $(window).on('click', function (event) {
        if ($(event.target).is(purchaseModal)) {
            purchaseModal.hide();
        }
    });

    // Calculate total amount dynamically
    const ticketPrices = {
        Regular: 20,
        VIP: 50,
        Student: 15,
    };

    function calculateTotal() {
        const ticketTypeValue = ticketType.val();
        const quantity = parseInt(quantityInput.val()) || 0;
        const price = ticketPrices[ticketTypeValue] || 0;
        totalAmount.text(`Total Amount: $${price * quantity}`);
    }

    ticketType.on('change', calculateTotal);
    quantityInput.on('input', calculateTotal);

    // Phone number auto-formatting (correctly formats 123-456-7890)
    phoneInput.on('input', function () {
        let value = phoneInput.val().replace(/\D/g, ''); // Remove non-numeric characters

        // Format as 123-456-7890
        if (value.length > 3 && value.length <= 6) {
            value = value.slice(0, 3) + '-' + value.slice(3, 6);
        } else if (value.length > 6) {
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
        }

        phoneInput.val(value); // Update the input field with the formatted value
    });

    // Handle form submission for purchasing tickets
    purchaseForm.on('submit', function (e) {
        e.preventDefault();

        // Validate email format before submission
        const emailValue = emailInput.val();
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

        if (!emailPattern.test(emailValue)) {
            alert("Please enter a valid email address.");
            return; // Stop form submission if email is invalid
        }

        const formData = {
            firstName: $('#first-name').val(),
            lastName: $('#last-name').val(),
            phone: phoneInput.val(),
            email: emailValue,
            eventName: $('#event-name').val(),
            eventDate: $('#event-date').val(),
            organizer: $('#organizer').val(),
            ticketType: ticketType.val(),
            quantity: quantityInput.val(),
        };

        // Store form data in localStorage
        localStorage.setItem('formData', JSON.stringify(formData));

        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    });

    // Login and Sign-Up Functionality
    // Toggle between Login and Sign Up forms
    $('#show-signup-form').click(function (e) {
        e.preventDefault();
        $('#login-form').hide();
        $('#signup-form').show();
    });

    // Handle Sign-Up Form Submission
    $('#signup-form').submit(function (e) {
        e.preventDefault();

        let username = $('#signup-username').val();
        let password = $('#signup-password').val();
        let email = $('#signup-email').val();

        // Simple validation
        if (!username || !password || !email) {
            alert("All fields are required.");
            return;
        }

        // Store user details (in localStorage for simplicity)
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('email', email);

        // After successful sign up, auto-login and redirect to home
        alert("Sign-up successful! You are now logged in.");
        localStorage.setItem('isLoggedIn', 'true'); // Mark as logged in
        window.location.href = 'index.html'; // Redirect to home page
    });

    // Handle Login Form Submission
    $('#login-form').submit(function (e) {
        e.preventDefault();

        let loginUsername = $('#login-username').val();
        let loginPassword = $('#login-password').val();

        let storedUsername = localStorage.getItem('username');
        let storedPassword = localStorage.getItem('password');

        // Validate login credentials
        if (loginUsername === storedUsername && loginPassword === storedPassword) {
            localStorage.setItem('isLoggedIn', 'true'); // Mark as logged in
            window.location.href = 'index.html'; // Redirect to home page
        } else {
            alert("Invalid username or password.");
        }
    });
});
