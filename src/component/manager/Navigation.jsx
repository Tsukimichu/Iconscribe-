import logo from '../../assets/ICONS.png';


const Navigation = ({ selectedSection, setSelectedSection, handleLogout }) => {
  const navItem = (label, key) => (
    <button
      className={`flex items-center px-4 py-3 w-full text-left transition ${
        selectedSection === key ? 'bg-white text-blue-900 font-semibold' : 'hover:bg-blue-800'
      }`}
      onClick={() => setSelectedSection(key)}
    >
      {label}
    </button>
  );

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen py-6 space-y-2">
      <img
        src={logo}
        alt="Logo"
        className="w-20 mb-6"
      />      {navItem('Overview', 'overview')}
      {navItem('Orders', 'orders')}
      {navItem('Product', 'products')}
      {navItem('Supply', 'supply')}
      {navItem('Sales & Expense', 'salesExpense')}
      {navItem('Archive', 'archive')}
      <button
        onClick={handleLogout}
        className="absolute bottom-6 left-4 right-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
      >
        Log out
      </button>
    </div>
  );
};

export default Navigation;
