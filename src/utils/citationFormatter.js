/**
 * Format a single BibTeX entry in MLA style
 */
function formatMLA(bib) {
  const { type, author, title, year } = bib;
  
  switch (type) {
    case 'article':
      // Article format: Author. "Title." Journal, vol. X, year, pp. XX-XX.
      return `${author}. "${title}." <em>${bib.journal}</em>, vol. ${bib.volume}, ${year}, pp. ${bib.pages}.`;
    
    case 'book':
      // Book format: Author. Title. Publisher, year.
      return `${author}. <em>${title}</em>. ${bib.publisher}, ${year}.`;
    
    case 'inproceedings':
      // Conference paper format: Author. "Title." Conference Name, year, pp. XX-XX.
      return `${author}. "${title}." <em>${bib.booktitle}</em>, ${year}, pp. ${bib.pages}.`;
    
    default:
      // Fallback for unknown types
      return `${author}. "${title}." ${year}.`;
  }
}

/**
 * Format a single BibTeX entry in APA style
 */
function formatAPA(bib) {
  const { type, author, title, year } = bib;
  
  switch (type) {
    case 'article':
      // Article format: Author. (year). Title. Journal, volume, pages.
      return `${author}. (${year}). ${title}. <em>${bib.journal}</em>, ${bib.volume}, ${bib.pages}.`;
    
    case 'book':
      // Book format: Author. (year). Title. Publisher.
      return `${author}. (${year}). <em>${title}</em>. ${bib.publisher}.`;
    
    case 'inproceedings':
      // Conference paper format: Author. (year). Title. Conference Name (pp. pages).
      return `${author}. (${year}). ${title}. <em>${bib.booktitle}</em> (pp. ${bib.pages}).`;
    
    default:
      return `${author}. (${year}). ${title}.`;
  }
}

/**
 * Format a single BibTeX entry in Harvard style
 */
function formatHarvard(bib) {
  const { type, author, title, year } = bib;
  
  switch (type) {
    case 'article':
      // Article format: Author (year) 'Title', Journal, volume(issue), pp. pages.
      return `${author} (${year}) '${title}', <em>${bib.journal}</em>, ${bib.volume}, pp. ${bib.pages}.`;
    
    case 'book':
      // Book format: Author (year) Title, Publisher, Location.
      const location = bib.address ? `, ${bib.address}` : '';
      return `${author} (${year}) <em>${title}</em>, ${bib.publisher}${location}.`;
    
    case 'inproceedings':
      // Conference paper format: Author (year) 'Title', Conference Name, pp. pages.
      return `${author} (${year}) '${title}', <em>${bib.booktitle}</em>, pp. ${bib.pages}.`;
    
    default:
      return `${author} (${year}) '${title}'.`;
  }
}


/**
 * Format a single BibTeX entry in Vancouver style (numbered)
 */
function formatVancouver(bib, index) {
  const { type, author, title, year } = bib;
  const number = index + 1;
  
  switch (type) {
    case 'article':
      // Article format: Number. Author. Title. Journal. year;volume:pages.
      return `${number}. ${author}. ${title}. ${bib.journal}. ${year};${bib.volume}:${bib.pages}.`;
    
    case 'book':
      // Book format: Number. Author. Title. Location: Publisher; year.
      const location = bib.address ? `${bib.address}: ` : '';
      return `${number}. ${author}. ${title}. ${location}${bib.publisher}; ${year}.`;
    
    case 'inproceedings':
      // Conference paper format: Number. Author. Title. In: Conference Name; year. p. pages.
      return `${number}. ${author}. ${title}. In: ${bib.booktitle}; ${year}. p. ${bib.pages}.`;
    
    default:
      return `${number}. ${author}. ${title}. ${year}.`;
  }
}

/**
 * Format a single BibTeX entry in Chicago style
 */
function formatChicago(bib) {
  const { type, author, title, year } = bib;
  
  switch (type) {
    case 'article':
      // Article format: Author. "Title." Journal volume, no. (year): pages.
      return `${author}. "${title}." <em>${bib.journal}</em> ${bib.volume} (${year}): ${bib.pages}.`;
    
    case 'book':
      // Book format: Author. Title. City: Publisher, year.
      const location = bib.address ? `${bib.address}: ` : '';
      return `${author}. <em>${title}</em>. ${location}${bib.publisher}, ${year}.`;
    
    case 'inproceedings':
      // Conference paper format: Author. "Title." In Conference Name, pages. Year.
      return `${author}. "${title}." In <em>${bib.booktitle}</em>, ${bib.pages}. ${year}.`;
    
    default:
      return `${author}. "${title}." ${year}.`;
  }
}

/**
 * Format an array of BibTeX entries in Chicago style
 */
export function formatBibliographyChicago(bibs) {
  return bibs.map(bib => formatChicago(bib));
}

/**
 * Format an array of BibTeX entries in Vancouver style
 */
export function formatBibliographyVancouver(bibs) {
  return bibs.map((bib, index) => formatVancouver(bib, index));
}

/**
 * Format an array of BibTeX entries in APA style
 */
export function formatBibliographyAPA(bibs) {
  return bibs.map(bib => formatAPA(bib));
}

/**
 * Format an array of BibTeX entries in MLA style
 */
export function formatBibliographyMLA(bibs) {
  return bibs.map(bib => formatMLA(bib));
}

/**
 * Format an array of BibTeX entries in Harvard style
 */
export function formatBibliographyHarvard(bibs) {
  return bibs.map(bib => formatHarvard(bib));
}
