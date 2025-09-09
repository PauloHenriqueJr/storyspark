// Temporary debug script to check admin access
// Use this in the browser console

const debugAdminAccess = () => {
    // Check local storage for user data
    const userData = localStorage.getItem('user');
    console.log('📊 User data from localStorage:', userData);

    // Check if user is authenticated
    const isAuth = localStorage.getItem('isAuthenticated');
    console.log('🔐 isAuthenticated:', isAuth);

    // Check current path
    console.log('🛣️ Current path:', window.location.pathname);

    // Try to access Supabase auth
    if (window.supabase) {
        window.supabase.auth.getUser().then(({ data: { user }, error }) => {
            console.log('👤 Supabase user:', user);
            console.log('❌ Supabase error:', error);
        });
    }

    // Check feature flags in sessionStorage/localStorage
    const flags = localStorage.getItem('featureFlags') || sessionStorage.getItem('featureFlags');
    console.log('🚩 Feature flags:', flags);
};

// Run debug
debugAdminAccess();

// Also check if React components are loaded
console.log('⚛️ React loaded:', typeof React !== 'undefined');
console.log('🏠 Window location:', window.location);

// Try to manually check admin features
console.log('🔍 Manual check complete - see logs above');
