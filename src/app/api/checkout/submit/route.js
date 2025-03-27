export async function POST(request) {
    try {
        // Parse the request body
        const {
            flightCredentials,
            billingAddress,
            creditCardInfo,
            selectedOutboundFlights,
            selectedReturnFlights,
        } = await request.json();

        // Validate the received data
        if (
            !flightCredentials ||
            !billingAddress ||
            !creditCardInfo ||
            !selectedOutboundFlights ||
            selectedOutboundFlights.length === 0
        ) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Example: Log the received data (you can replace this with database logic)
        console.log('Flight Credentials:', flightCredentials);
        console.log('Billing Address:', billingAddress);
        console.log('Credit Card Info:', creditCardInfo);
        console.log('Selected Outbound Flights:', selectedOutboundFlights);
        console.log('Selected Return Flights:', selectedReturnFlights);

        // Example: Save the data to a database (replace this with your database logic)
        // await saveToDatabase({
        //     flightCredentials,
        //     billingAddress,
        //     creditCardInfo,
        //     selectedOutboundFlights,
        //     selectedReturnFlights,
        // });

        // Return a success response
        return new Response(
            JSON.stringify({ message: 'Checkout data submitted successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error processing checkout submission:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}