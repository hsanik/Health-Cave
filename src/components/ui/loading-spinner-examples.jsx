// LOADING SPINNER USAGE EXAMPLES
// This file shows how to use the different loading spinner components

import React from "react";
import {
    LoadingSpinner,
    ButtonSpinner,
    PageSpinner,
    FullPageSpinner,
    InlineSpinner
} from "./loading-spinner";

const LoadingSpinnerExamples = () => {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">Loading Spinner Examples</h1>

            {/* Basic LoadingSpinner with different sizes */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Basic Spinner - Different Sizes</h2>
                <div className="flex items-center space-x-4">
                    <LoadingSpinner size="sm" />
                    <LoadingSpinner size="default" />
                    <LoadingSpinner size="lg" />
                    <LoadingSpinner size="xl" />
                </div>
            </section>

            {/* Different variants */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Different Color Variants</h2>
                <div className="flex items-center space-x-4">
                    <LoadingSpinner variant="default" />
                    <LoadingSpinner variant="primary" />
                    <LoadingSpinner variant="success" />
                    <LoadingSpinner variant="warning" />
                    <LoadingSpinner variant="danger" />
                </div>
            </section>

            {/* With text */}
            <section>
                <h2 className="text-lg font-semibold mb-4">With Text</h2>
                <div className="space-y-2">
                    <LoadingSpinner text="Loading..." variant="primary" />
                    <LoadingSpinner text="Processing payment..." variant="success" size="lg" />
                </div>
            </section>

            {/* Button Spinner */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Button Spinner</h2>
                <div className="space-x-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled>
                        <ButtonSpinner text="Signing in..." />
                    </button>
                    <button className="border border-gray-300 px-4 py-2 rounded disabled:opacity-50" disabled>
                        <ButtonSpinner text="Connecting..." variant="default" />
                    </button>
                </div>
            </section>

            {/* Page Spinner */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Page Spinner</h2>
                <div className="border rounded-lg">
                    <PageSpinner text="Loading appointments..." />
                </div>
            </section>

            {/* Inline Spinner */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Inline Spinner</h2>
                <p className="flex items-center space-x-2">
                    <span>Fetching data</span>
                    <InlineSpinner />
                </p>
            </section>

            {/* Usage in different contexts */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Common Usage Patterns</h2>
                <div className="space-y-4">

                    {/* Loading state for forms */}
                    <div className="p-4 border rounded">
                        <h3 className="font-medium mb-2">Form Loading State</h3>
                        <button className="bg-[#435ba1] text-white px-6 py-2 rounded disabled:opacity-50" disabled>
                            <ButtonSpinner text="Creating appointment..." />
                        </button>
                    </div>

                    {/* Loading state for data fetching */}
                    <div className="p-4 border rounded">
                        <h3 className="font-medium mb-2">Data Fetching</h3>
                        <div className="flex items-center space-x-2">
                            <InlineSpinner size="sm" />
                            <span className="text-sm text-gray-600">Refreshing appointments...</span>
                        </div>
                    </div>

                    {/* Loading state for cards */}
                    <div className="p-4 border rounded">
                        <h3 className="font-medium mb-2">Card Loading State</h3>
                        <div className="bg-gray-50 p-4 rounded">
                            <LoadingSpinner text="Loading doctor information..." variant="primary" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoadingSpinnerExamples;

/* 
USAGE EXAMPLES:

1. Button Loading State:
   <Button disabled={isLoading}>
     {isLoading ? <ButtonSpinner text="Saving..." /> : "Save"}
   </Button>

2. Page Loading:
   {loading ? <PageSpinner text="Loading appointments..." /> : <AppointmentsList />}

3. Full Page Loading (for route changes):
   {isNavigating && <FullPageSpinner text="Loading..." />}

4. Inline Loading:
   <div className="flex items-center space-x-2">
     <span>Refreshing</span>
     <InlineSpinner />
   </div>

5. Custom Loading with specific styling:
   <LoadingSpinner 
     size="lg" 
     variant="success" 
     text="Payment processing..." 
     className="my-4" 
   />

6. API Call Loading:
   const [loading, setLoading] = useState(false);
   
   const handleSubmit = async () => {
     setLoading(true);
     try {
       await api.call();
     } finally {
       setLoading(false);
     }
   };
   
   return (
     <button disabled={loading}>
       {loading ? <ButtonSpinner text="Processing..." /> : "Submit"}
     </button>
   );
*/