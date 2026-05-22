import React from "react";
import { createRoot } from "react-dom/client";
import {
  PageLayout, Grid, Card, Heading, Paragraph,
  Button, IconButton, Icon, Link, Tabs, TabList, Tab, TabPanel,
  SegmentedControl, Pagination, MessageBanner, MessageBadge, Notification,
} from "../../packages/react/src/index.js";

// ─── Content data ─────────────────────────────────────────────────────────────

const STAFF_PICKS = [
  {
    id: 101, title: "The Midnight Library", author: "Matt Haig", genre: "Fiction",
    price: "$16.99", accent: 0,
    description: "Nora Seed discovers a library between life and death, where each book contains a different life she could have lived. A luminous novel about regret, hope, and the choices that make us who we are.",
  },
  {
    id: 102, title: "Educated", author: "Tara Westover", genre: "Memoir",
    price: "$15.99", accent: 1,
    description: "A stunning memoir about a woman who grew up in a survivalist family in the mountains of Idaho, and the transformative power of education that eventually led her to Cambridge and Harvard.",
  },
  {
    id: 103, title: "Project Hail Mary", author: "Andy Weir", genre: "Science Fiction",
    price: "$17.99", accent: 2,
    description: "Ryland Grace wakes up alone on a spaceship with no memory, millions of miles from home. A propulsive, ingeniously plotted novel about one man's mission to save humanity.",
  },
];

const BOOKS = [
  {
    id: 1, title: "Lessons in Chemistry", author: "Bonnie Garmus",
    genre: "fiction", price: "$15.99", accent: 0,
    description: "Set in early 1960s California, chemist Elizabeth Zott becomes the unlikely host of a cooking show where she teaches housewives to think for themselves — and sparks a quiet revolution.",
  },
  {
    id: 2, title: "Babel", author: "R.F. Kuang",
    genre: "fiction", price: "$18.99", accent: 1,
    description: "A dark academia novel following students at Oxford's Royal Institute of Translation in the 1830s, as they uncover the colonialism underpinning the empire's magic of silver-working.",
  },
  {
    id: 3, title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin",
    genre: "fiction", price: "$16.99", accent: 2,
    description: "Two friends — Sam and Sadie — span three decades of game design, creative partnership, and shifting love in this dazzling novel about art, ambition, and what we make together.",
  },
  {
    id: 4, title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid",
    genre: "fiction", price: "$14.99", accent: 3,
    description: "Aging Hollywood icon Evelyn Hugo finally agrees to tell the story of her seven marriages — and the one great love at the center of them all.",
  },
  {
    id: 5, title: "Fourth Wing", author: "Rebecca Yarros",
    genre: "fiction", price: "$17.99", accent: 4,
    description: "At Basgiath War College, Violet Sorrengail is forced into the riders' quadrant where she must bond with a dragon or die. A fierce, romantic fantasy that took the world by storm.",
  },
  {
    id: 6, title: "Intermezzo", author: "Sally Rooney",
    genre: "fiction", price: "$24.99", accent: 0,
    description: "Two brothers — a grieving chess prodigy and his older lawyer brother — navigate loss, love, and unexpected connection in Rooney's most emotionally expansive novel yet.",
  },
  {
    id: 7, title: "House of Leaves", author: "Mark Z. Danielewski",
    genre: "mystery", price: "$19.99", accent: 1,
    description: "A young family discovers their new home is larger on the inside than the outside. A layered, labyrinthine horror novel unlike anything before or since.",
  },
  {
    id: 8, title: "The Thursday Murder Club", author: "Richard Osman",
    genre: "mystery", price: "$15.99", accent: 2,
    description: "Four septuagenarians in a quiet retirement village meet weekly to solve cold cases — until a real murder lands right on their doorstep.",
  },
  {
    id: 9, title: "In the Woods", author: "Tana French",
    genre: "mystery", price: "$14.99", accent: 3,
    description: "Detective Rob Ryan investigates a murder in a Dublin suburb near the woods where he survived a childhood tragedy that has haunted him ever since.",
  },
  {
    id: 10, title: "Spare", author: "Prince Harry",
    genre: "nonfiction", price: "$19.99", accent: 4,
    description: "Prince Harry's unflinching memoir recounts his life in the royal family, the unrelenting intrusions of the press, and the loss that shaped everything that followed.",
  },
  {
    id: 11, title: "Atomic Habits", author: "James Clear",
    genre: "nonfiction", price: "$16.99", accent: 0,
    description: "A comprehensive guide to building good habits and breaking bad ones, drawing on psychology and neuroscience to offer a proven framework for lasting behavior change.",
  },
  {
    id: 12, title: "The Body Keeps the Score", author: "Bessel van der Kolk",
    genre: "nonfiction", price: "$17.99", accent: 1,
    description: "Pioneering researcher Bessel van der Kolk reveals how trauma reshapes both mind and body, and what science now tells us about the path toward recovery and healing.",
  },
  {
    id: 13, title: "Say Nothing", author: "Patrick Radden Keefe",
    genre: "nonfiction", price: "$18.99", accent: 2,
    description: "A gripping account of the murder of Jean McConville and the decades-long search for truth that illuminates the violence and moral compromises of the Irish Troubles.",
  },
  {
    id: 14, title: "The Mountain in the Sea", author: "Ray Nayler",
    genre: "scifi", price: "$17.99", accent: 3,
    description: "A researcher discovers a new form of intelligence in the waters off Con Dao archipelago — a layered debut about consciousness, language, and what it means to be human.",
  },
  {
    id: 15, title: "A Memory Called Empire", author: "Arkady Martine",
    genre: "scifi", price: "$16.99", accent: 4,
    description: "Ambassador Mahit Dzmare arrives in the capitol of a vast interstellar empire and uncovers a conspiracy behind her predecessor's disappearance, all while navigating treacherous court politics.",
  },
  {
    id: 16, title: "The Ministry for the Future", author: "Kim Stanley Robinson",
    genre: "scifi", price: "$15.99", accent: 0,
    description: "A small agency tasked with representing future generations battles the climate crisis through interconnected voices across the globe, in Robinson's most visionary novel.",
  },
];

const ALL_BOOKS = [...STAFF_PICKS, ...BOOKS];

const GENRES = [
  { value: "all",        label: "All" },
  { value: "fiction",    label: "Fiction" },
  { value: "nonfiction", label: "Non-Fiction" },
  { value: "mystery",    label: "Mystery" },
  { value: "scifi",      label: "Science Fiction" },
];

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured" },
  { value: "bestseller", label: "Best Sellers" },
  { value: "newest",     label: "New Arrivals" },
  { value: "price",      label: "Price ↑" },
];

const BOOKS_PER_PAGE = 6;

// ─── Cover accent palettes ────────────────────────────────────────────────────

const ACCENTS = [
  { bg: "var(--semantic-color-action-surface)",         icon: "var(--semantic-color-action-background)" },
  { bg: "var(--semantic-color-status-info-surface)",    icon: "var(--semantic-color-status-info-background)" },
  { bg: "var(--semantic-color-status-success-surface)", icon: "var(--semantic-color-status-success-background)" },
  { bg: "var(--semantic-color-status-warn-surface)",    icon: "var(--semantic-color-status-warn-background)" },
  { bg: "var(--semantic-color-status-error-surface)",   icon: "var(--semantic-color-status-error-background)" },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

function BookCover({ accent = 0, height = 160 }) {
  const c = ACCENTS[accent % ACCENTS.length];
  return (
    <div style={{
      height,
      borderRadius: "var(--base-radius-md)",
      background: c.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "var(--base-spacing-12)",
    }}>
      <Icon name="menu_book" style={{ fontSize: "2rem", color: c.icon }} />
    </div>
  );
}

function StaffPickCard({ book, onSelect }) {
  return (
    <Card shadow="md" style={{ padding: "var(--base-spacing-16)" }}>
      <BookCover accent={book.accent} height={180} />
      <Heading as="h3" size="xs" style={{ marginBottom: "var(--base-spacing-4)" }}>
        <Link as="button" type="button" onClick={() => onSelect(book)}>
          {book.title}
        </Link>
      </Heading>
      <Paragraph size="sm" color="muted" style={{ marginBottom: "var(--base-spacing-4)" }}>
        {book.author}
      </Paragraph>
      <Paragraph size="xs" color="muted" style={{ marginBottom: "var(--base-spacing-16)" }}>
        {book.genre}
      </Paragraph>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Paragraph size="sm" style={{ fontWeight: "var(--base-font-weight-semibold)" }}>
          {book.price}
        </Paragraph>
        <Button variant="secondary" icon="add_shopping_cart" iconPosition="start">
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}

function BookCard({ book, onSelect }) {
  return (
    <Card shadow="sm" style={{ padding: "var(--base-spacing-16)" }}>
      <BookCover accent={book.accent} height={140} />
      <Heading as="h3" size="xs" style={{ marginBottom: "var(--base-spacing-4)" }}>
        <Link as="button" type="button" onClick={() => onSelect(book)}>
          {book.title}
        </Link>
      </Heading>
      <Paragraph size="xs" color="muted" style={{ marginBottom: "var(--base-spacing-12)" }}>
        {book.author}
      </Paragraph>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Paragraph size="sm" style={{ fontWeight: "var(--base-font-weight-semibold)" }}>
          {book.price}
        </Paragraph>
        <IconButton icon="add_shopping_cart" label={`Add ${book.title} to cart`} variant="tertiary" />
      </div>
    </Card>
  );
}

function BooksGrid({ books, page, totalPages, onPageChange, onSelect }) {
  return (
    <>
      <Grid columns={{ xs: 1, sm: 2, md: 3 }} gap={24} style={{ marginBottom: "var(--base-spacing-32)" }}>
        {books.map(book => (
          <BookCard key={book.id} book={book} onSelect={onSelect} />
        ))}
      </Grid>
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </>
  );
}

// ─── Detail page ──────────────────────────────────────────────────────────────

function genreLabel(genreValue) {
  const found = GENRES.find(g => g.value === genreValue?.toLowerCase());
  return found ? found.label : genreValue;
}

function BookDetailPage({ book, onBack, onSelect }) {
  const related = ALL_BOOKS
    .filter(b => b.genre?.toLowerCase() === book.genre?.toLowerCase() && b.id !== book.id)
    .slice(0, 3);

  const accent = ACCENTS[book.accent % ACCENTS.length];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "var(--base-spacing-32) var(--base-spacing-24) var(--base-spacing-64)" }}>

      {/* Back link */}
      <div style={{ marginBottom: "var(--base-spacing-32)" }}>
        <Link as="button" type="button" icon="arrow_back" onClick={onBack}>
          All Books
        </Link>
      </div>

      {/* Book detail: cover + info */}
      <Grid columns={{ xs: 1, md: 2 }} gap={48} style={{ marginBottom: "var(--base-spacing-56)" }}>

        <div style={{
          height: 420,
          borderRadius: "var(--base-radius-lg)",
          background: accent.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Icon name="menu_book" style={{ fontSize: "5rem", color: accent.icon }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <div>
            <Heading as="h1" size="xl" style={{ marginBottom: "var(--base-spacing-8)" }}>
              {book.title}
            </Heading>
            <Paragraph size="lg" color="muted">{book.author}</Paragraph>
          </div>

          <div>
            <MessageBadge status="neutral">{genreLabel(book.genre)}</MessageBadge>
          </div>

          <Paragraph size="md">{book.description}</Paragraph>

          <div style={{
            padding: "var(--base-spacing-20)",
            background: "var(--semantic-color-surface-panel)",
            borderRadius: "var(--base-radius-md)",
            border: "1px solid var(--semantic-color-border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--base-spacing-16)",
            flexWrap: "wrap",
          }}>
            <Heading as="p" size="md">{book.price}</Heading>
            <div style={{ display: "flex", gap: "var(--base-spacing-12)", flexWrap: "wrap" }}>
              <Button variant="primary" icon="add_shopping_cart" iconPosition="start">
                Add to Cart
              </Button>
              <Button variant="secondary" icon="favorite" iconPosition="start">
                Wishlist
              </Button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--base-spacing-8)", flexWrap: "wrap" }}>
            <MessageBadge status="success" icon="local_shipping">Free shipping over $35</MessageBadge>
            <MessageBadge status="info" icon="autorenew">Free returns</MessageBadge>
          </div>
        </div>
      </Grid>

      {/* Related books */}
      {related.length > 0 && (
        <section>
          <Heading as="h2" size="md" style={{ marginBottom: "var(--base-spacing-20)" }}>
            You Might Also Like
          </Heading>
          <Grid columns={{ xs: 1, sm: 3 }} gap={24}>
            {related.map(b => (
              <BookCard key={b.id} book={b} onSelect={onSelect} />
            ))}
          </Grid>
        </section>
      )}
    </div>
  );
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

function Homepage({ onSelect }) {
  const [showBanner, setShowBanner] = React.useState(true);
  const [genre, setGenre]           = React.useState("all");
  const [sort, setSort]             = React.useState("featured");
  const [page, setPage]             = React.useState(1);

  function handleGenreChange(g) {
    setGenre(g);
    setPage(1);
  }

  function filteredAndPaged(genreValue) {
    const filtered = genreValue === "all" ? BOOKS : BOOKS.filter(b => b.genre === genreValue);
    const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
    const paged = filtered.slice((page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE);
    return { paged, totalPages };
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--base-spacing-24)" }}>

      {/* Hero */}
      <section style={{ padding: "var(--base-spacing-64) 0 var(--base-spacing-48)", textAlign: "center" }}>
        <Heading as="h1" size="xl" style={{ marginBottom: "var(--base-spacing-16)" }}>
          Your Next Great Read Awaits
        </Heading>
        <Paragraph
          size="lg"
          color="muted"
          style={{ marginBottom: "var(--base-spacing-32)", maxWidth: "540px", margin: "0 auto var(--base-spacing-32)" }}
        >
          Handpicked titles, indie treasures, and bestsellers — curated for every reader.
        </Paragraph>
        <div style={{ display: "flex", gap: "var(--base-spacing-12)", justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="primary" icon="arrow_forward" iconPosition="end">Shop Now</Button>
          <Button variant="secondary">View Gift Cards</Button>
        </div>
      </section>

      {/* Promo banner */}
      {showBanner && (
        <div style={{ marginBottom: "var(--base-spacing-48)" }}>
          <MessageBanner
            status="info"
            title="Free shipping on orders over $35"
            onDismiss={() => setShowBanner(false)}
          >
            Use code <strong>READER</strong> at checkout for an extra 10% off your first order.
          </MessageBanner>
        </div>
      )}

      {/* Staff picks */}
      <section style={{ marginBottom: "var(--base-spacing-56)" }}>
        <div style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "var(--base-spacing-20)",
        }}>
          <Heading as="h2" size="md">Staff Picks</Heading>
          <Link href="#">View all</Link>
        </div>
        <Grid columns={{ xs: 1, sm: 3 }} gap={24}>
          {STAFF_PICKS.map(book => (
            <StaffPickCard key={book.id} book={book} onSelect={onSelect} />
          ))}
        </Grid>
      </section>

      {/* Browse section */}
      <section style={{ marginBottom: "var(--base-spacing-64)" }}>
        <Heading as="h2" size="md" style={{ marginBottom: "var(--base-spacing-24)" }}>Browse Books</Heading>

        <Tabs value={genre} onChange={handleGenreChange}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--base-spacing-12)",
            marginBottom: "var(--base-spacing-24)",
          }}>
            <TabList>
              {GENRES.map(g => <Tab key={g.value} value={g.value}>{g.label}</Tab>)}
            </TabList>
            <SegmentedControl options={SORT_OPTIONS} value={sort} onChange={setSort} />
          </div>

          {GENRES.map(g => {
            const { paged, totalPages } = filteredAndPaged(g.value);
            return (
              <TabPanel key={g.value} value={g.value}>
                <BooksGrid
                  books={paged}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  onSelect={onSelect}
                />
              </TabPanel>
            );
          })}
        </Tabs>
      </section>

    </div>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────

function App() {
  const [dark, setDark]                 = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [cartCount, setCartCount]       = React.useState(3);

  React.useEffect(() => {
    document.documentElement.classList.toggle("a1-theme-dark", dark);
  }, [dark]);

  function handleSelect(book) {
    setSelectedBook(book);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setSelectedBook(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const header = (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--base-spacing-24)",
      padding: "var(--base-spacing-12) var(--base-spacing-24)",
      background: "var(--semantic-color-surface-panel)",
      borderBottom: "1px solid var(--semantic-color-border-subtle)",
    }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", flexShrink: 0, cursor: "pointer" }}
        onClick={handleBack}
        role="link"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && handleBack()}
      >
        <Icon name="menu_book" style={{ fontSize: "1.25rem", color: "var(--semantic-color-action-background)" }} />
        <Heading as="span" size="xs">Chapter &amp; Verse</Heading>
      </div>

      <nav style={{ display: "flex", gap: "var(--base-spacing-20)", flex: 1 }}>
        <Link as="button" type="button" onClick={handleBack}>Browse</Link>
        <Link href="#">Bestsellers</Link>
        <Link href="#">New Arrivals</Link>
        <Link href="#">Gift Cards</Link>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)", flexShrink: 0 }}>
        <Notification count={cartCount} variant="error">
          <IconButton
            icon="shopping_cart"
            label="View cart"
            variant="tertiary"
            onClick={() => setCartCount(0)}
          />
        </Notification>
        <IconButton
          icon={dark ? "light_mode" : "dark_mode"}
          label={dark ? "Switch to light mode" : "Switch to dark mode"}
          variant="tertiary"
          onClick={() => setDark(d => !d)}
        />
      </div>
    </div>
  );

  const footer = (
    <div style={{
      padding: "var(--base-spacing-40) var(--base-spacing-24) var(--base-spacing-24)",
      background: "var(--semantic-color-surface-panel)",
      borderTop: "1px solid var(--semantic-color-border-subtle)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Grid columns={{ xs: 2, md: 4 }} gap={32}>
          <div>
            <Heading as="p" size="xs" style={{ marginBottom: "var(--base-spacing-12)" }}>Shop</Heading>
            {["New Arrivals", "Bestsellers", "Staff Picks", "Gift Cards"].map(t => (
              <div key={t} style={{ marginBottom: "var(--base-spacing-8)" }}>
                <Link href="#"><Paragraph as="span" size="sm">{t}</Paragraph></Link>
              </div>
            ))}
          </div>
          <div>
            <Heading as="p" size="xs" style={{ marginBottom: "var(--base-spacing-12)" }}>Genres</Heading>
            {["Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Biography"].map(t => (
              <div key={t} style={{ marginBottom: "var(--base-spacing-8)" }}>
                <Link href="#"><Paragraph as="span" size="sm">{t}</Paragraph></Link>
              </div>
            ))}
          </div>
          <div>
            <Heading as="p" size="xs" style={{ marginBottom: "var(--base-spacing-12)" }}>Company</Heading>
            {["About Us", "Blog", "Careers", "Press"].map(t => (
              <div key={t} style={{ marginBottom: "var(--base-spacing-8)" }}>
                <Link href="#"><Paragraph as="span" size="sm">{t}</Paragraph></Link>
              </div>
            ))}
          </div>
          <div>
            <Heading as="p" size="xs" style={{ marginBottom: "var(--base-spacing-12)" }}>Support</Heading>
            {["FAQ", "Shipping", "Returns", "Contact Us"].map(t => (
              <div key={t} style={{ marginBottom: "var(--base-spacing-8)" }}>
                <Link href="#"><Paragraph as="span" size="sm">{t}</Paragraph></Link>
              </div>
            ))}
          </div>
        </Grid>
        <div style={{
          marginTop: "var(--base-spacing-32)",
          paddingTop: "var(--base-spacing-16)",
          borderTop: "1px solid var(--semantic-color-border-subtle)",
        }}>
          <Paragraph size="xs" color="muted">© 2026 Chapter &amp; Verse. All rights reserved.</Paragraph>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout stickyHeader header={header} footer={footer}>
      {selectedBook
        ? <BookDetailPage book={selectedBook} onBack={handleBack} onSelect={handleSelect} />
        : <Homepage onSelect={handleSelect} />
      }
    </PageLayout>
  );
}

createRoot(document.getElementById("root")).render(<App />);
