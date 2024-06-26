import { buildUrlImage } from 'src/utils/url-builder';

export function transformBook(book) {
  const scriptWriters = transformAuthors(book?.attributes.ScriptWriters);
  const artists = transformAuthors(book?.attributes.Artists);
  return book
    ? {
        id: book.id,
        title: book.attributes.Title,
        slug: book.attributes.Slug,
        scriptWriters,
        artists,
        authors: mergeById(scriptWriters, artists),
        series: transformSerie(book.attributes.Series?.data),
        seriesVolume: book.attributes.SeriesVolume,
        type: book.attributes.Type,
        genre: transformGenre(book.attributes.Genre?.data),
        images: book.attributes.Images.data.map((item) => ({
          ...item.attributes,
          url: buildUrlImage(item.attributes.url),
        })),
        coverUrl: buildUrlImage(book.attributes.Images.data[0].attributes.url),
        ageGroup: book.attributes.AgeGroup,
        pageCount: book.attributes.PageCount,
        publicationYear: book.attributes.PublicationYear,
        isbn13: book.attributes.ISBN13,
        description: book.attributes.Description,
        descriptionText: book.attributes.Description?.filter(
          (block) => block.type === 'paragraph'
        ).reduce(
          (desc, paragraph) =>
            desc + paragraph.children.reduce((text, item) => `${text} ${item.text}`, ''),
          ''
        ),
        isOneShot: book.attributes.Series?.data === null,
        publisher: transformPublisher(book.attributes.Publisher?.data),
      }
    : null;
}

export function transformPublisher(publisher) {
  return publisher
    ? {
        id: publisher.id,
        name: publisher.attributes.Name,
        country: publisher.attributes.Country,
      }
    : null;
}

export function transformSerie(serie) {
  return serie
    ? {
        id: serie.id,
        name: serie.attributes?.Name,
        slug: serie.attributes?.Slug,
        ended: serie.attributes?.Ended,
        firstPublicationYear: serie.attributes?.FirstPublicationYear,
        creators: transformAuthors(serie.attributes?.Creators),
        description: serie.attributes?.Description,
        books: serie.attributes?.Books?.data
          .map((book) => transformBook(book))
          .sort((a, b) => a.seriesVolume - b.seriesVolume),
      }
    : null;
}

function transformAuthors(data) {
  return data ? data.data.map((author) => transformAuthor(author)) : [];
}

export function transformAuthor(author) {
  const scripts =
    author && author.attributes.scripts
      ? author.attributes.scripts?.data.map((book) => transformBook(book))
      : [];
  const arts =
    author && author.attributes.arts
      ? author.attributes.arts?.data.map((book) => transformBook(book))
      : [];
  const books = mergeById(scripts, arts);
  return author
    ? {
        id: author.id,
        name: author.attributes.Name,
        slug: author.attributes.Slug,
        bio: author.attributes.Bio,
        photoUrl: buildUrlImage(author.attributes.Photo?.data.attributes.url),
        series: author.attributes.series?.data.map((serie) => transformSerie(serie)),
        scripts,
        arts,
        books,
        oneShots: books.filter((book) => book.isOneShot),
      }
    : [];
}

function mergeById(array1, array2) {
  return array1
    .concat(array2)
    .sort((a, b) => a.id - b.id)
    .filter((item, pos, ary) => !pos || item.id !== ary[pos - 1].id)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function transformGenre(genre) {
  console.log(genre);
  return genre
    ? {
        id: genre.id,
        title: genre.attributes?.Title,
        slug: genre.attributes?.Slug,
      }
    : null;
}
