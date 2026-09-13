import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import { FOOTER_BRAND, FOOTER_COLUMNS } from "../home/_constants/footer";
import { useWishlist } from "./_hooks/useWishlist";
import WishlistBreadcrumb from "./_components/WishlistBreadcrumb";
import WishlistHeader from "./_components/WishlistHeader";
import WishlistGrid from "./_components/WishlistGrid";
import WishlistEmptyState from "./_components/WishlistEmptyState";
import WishlistToast from "./_components/WishlistToast";

export default function WishlistPage() {
  const {
    items,
    displayedItems,
    summary,
    isEmpty,
    toastMessage,
    addedItemIds,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    handleAddToCart,
    handleAddAllToCart,
    handleRemoveItem,
    handleClearAll,
  } = useWishlist();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <WishlistToast message={toastMessage} />

      <WishlistBreadcrumb count={items.length} />

      <main className="max-w-[1360px] mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <WishlistHeader
          count={items.length}
          summary={summary}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddAllToCart={handleAddAllToCart}
          onClearAll={handleClearAll}
        />

        {isEmpty ? (
          <WishlistEmptyState />
        ) : (
          <WishlistGrid
            items={displayedItems}
            addedItemIds={addedItemIds}
            onAddToCart={handleAddToCart}
            onRemove={handleRemoveItem}
            onResetSearch={() => setSearchTerm("")}
          />
        )}
      </main>

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
