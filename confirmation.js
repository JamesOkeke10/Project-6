$(document).ready(function () {
    const formData = JSON.parse(localStorage.getItem('formData'));

    if (formData) {
        // Define ticket prices
        const ticketPrices = {
            Regular: 20,
            VIP: 50,
            Student: 15,
        };

        // Calculate the total amount
        const pricePerTicket = ticketPrices[formData.ticketType] || 0;
        const totalAmount = pricePerTicket * parseInt(formData.quantity);

        // Populate the confirmation details
        $('#confirmation').html(`
            <h1>Thank You for Your Purchase!</h1>
            <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Event:</strong> ${formData.eventName}</p>
            <p><strong>Ticket Type:</strong> ${formData.ticketType}</p>
            <p><strong>Quantity:</strong> ${formData.quantity}</p>
            <p><strong>Total Amount:</strong> $${totalAmount}</p>
        `);

        // Handle payment form submission
        $('#payment-form').on('submit', function (e) {
            e.preventDefault();

            // Collect payment data
            const paymentData = {
                cardName: $('#card-name').val(),
                cardNumber: $('#card-number').val(),
                expiryDate: $('#expiry-date').val(),
                cvv: $('#cvv').val(),
            };

            // Simple client-side validation for format
            if (!isValidCardNumber(paymentData.cardNumber)) {
                $('#payment-status').html('<p style="color: red;">Invalid card number format. It should be in XXXX XXXX XXXX XXXX format.</p>');
                return;
            }
            if (!isValidExpiryDate(paymentData.expiryDate)) {
                $('#payment-status').html('<p style="color: red;">Invalid expiry date format. Please use MM/YY format.</p>');
                return;
            }
            if (!isFutureExpiry(paymentData.expiryDate)) {
                $('#payment-status').html('<p style="color: red;">Your card has expired. Please check the expiry date.</p>');
                return;
            }
            if (!isValidCVV(paymentData.cvv)) {
                $('#payment-status').html('<p style="color: red;">Invalid CVV format. It should be 3 digits.</p>');
                return;
            }

            // Mock payment processing (simulate success or failure)
            const paymentSuccess = Math.random() > 0.5; // Randomly simulate success or failure

            if (paymentSuccess) {
                $('#payment-status').html(`
                    <p style="color: green; font-weight: bold;">Payment successful! Thank you for your purchase of $${totalAmount}.</p>
                `);

                // Show payment success modal
                $('#amount-paid').text(totalAmount);
                $('#payment-success-modal').show();

                // Optionally, you can clear form data here after successful payment:
                localStorage.removeItem('formData');
            } else {
                $('#payment-status').html(`
                    <p style="color: red; font-weight: bold;">Payment failed. Please check your details and try again.</p>
                `);
            }
        });

        // Input formatting using jQuery
        $('#card-number').on('input', function () {
            var formatted = $(this).val().replace(/\D/g, '').replace(/(.{4})(?=.)/g, '$1 ').trim();
            $(this).val(formatted);

            // Stop input after 16 characters (4 groups of 4 digits)
            if ($(this).val().replace(/\D/g, '').length >= 16) {
                $(this).attr('maxlength', '19'); // Stops at 19 characters (including spaces)
            } else {
                $(this).removeAttr('maxlength');
            }
        });

        $('#expiry-date').on('input', function () {
            var formatted = $(this).val().replace(/\D/g, '').replace(/(.{2})(?=.)/g, '$1/').trim();
            $(this).val(formatted);

            // Stop input after 5 characters (MM/YY format)
            if ($(this).val().length >= 5) {
                $(this).attr('maxlength', '5'); // Stops at MM/YY format
            } else {
                $(this).removeAttr('maxlength');
            }
        });

        $('#cvv').on('input', function () {
            // Stop input after 3 characters for CVV
            if ($(this).val().length >= 3) {
                $(this).attr('maxlength', '3'); // Stops at 3 digits
            } else {
                $(this).removeAttr('maxlength');
            }
        });

        // Utility functions for input validation
        function isValidCardNumber(cardNumber) {
            return /^\d{4} \d{4} \d{4} \d{4}$/.test(cardNumber);
        }

        function isValidExpiryDate(expiryDate) {
            return /^\d{2}\/\d{2}$/.test(expiryDate); // Ensures MM/YY format
        }

        function isValidCVV(cvv) {
            return /^\d{3}$/.test(cvv);
        }

        function isFutureExpiry(expiryDate) {
            const currentDate = new Date();
            const [month, year] = expiryDate.split('/');
        
            // Ensure the expiry year and month are valid
            if (
                !month || 
                !year || 
                isNaN(month) || 
                isNaN(year) || 
                month < 1 || 
                month > 12 || 
                year.length !== 2
            ) {
                return false;
            }
        
            // Convert year to YYYY and parse month
            const expiryYear = parseInt('20' + year, 10); // Convert YY to YYYY
            const expiryMonth = parseInt(month, 10) - 1;  // Convert to 0-based index
        
            // Create expiry date object (end of the expiry month)
            const expiryDateObj = new Date(expiryYear, expiryMonth + 1, 0);
        
            // Check if expiry date is in the future
            return expiryDateObj > currentDate;
        }
        

        // Close modal when 'x' button is clicked
        $('.close-btn').on('click', function () {
            $('#payment-success-modal').hide();
        });

        // Close modal if click outside of modal content
        $(window).on('click', function (event) {
            if ($(event.target).is('#payment-success-modal')) {
                $('#payment-success-modal').hide();
            }
        });
    } else {
        // Handle case when no data is available
        $('#confirmation').html('<p>No data available. Please return to the purchase page.</p>');
    }
});
