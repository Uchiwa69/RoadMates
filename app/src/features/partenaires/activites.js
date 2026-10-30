// « À faire » : lieux publics et activités emblématiques, contenu éditorial statique.
// Règles : de vrais lieux publics décrits sobrement ; aucun horaire, prix précis, note ou avis inventé.
// Le prix est une indication (gratuit, €, €€, €€€). `aPlusieurs` dit pourquoi c'est mieux à plusieurs.
// Aucune donnée pour le Portugal : les résultats du parcours de démo ne changent pas.

export const CATEGORIES_ACTIVITE = {
  culture: 'Culture',
  'plein-air': 'Plein air',
  food: 'Food',
  nuit: 'Vie nocturne',
  'bien-etre': 'Bien-être',
}

const a = (id, ville, titre, categorie, quartier, prix, description, aPlusieurs) =>
  ({ id, ville, titre, categorie, quartier, prix, description, aPlusieurs })

export const ACTIVITES = [
  // Lyon
  a('a-lyon-traboules', 'Lyon', 'Vieux Lyon et ses traboules', 'culture', 'Vieux Lyon', 'gratuit',
    'Ruelles Renaissance au pied de Fourvière, reliées par des passages couverts qui traversent les immeubles.',
    'On se repère mieux à plusieurs dans les passages, et chacun repère des détails différents.'),
  a('a-lyon-fourviere', 'Lyon', 'Colline de Fourvière', 'culture', 'Fourvière', 'gratuit',
    'Basilique, théâtres antiques et esplanade avec vue sur toute la ville.',
    'La montée à pied passe plus vite en discutant, et la vue se partage.'),
  a('a-lyon-confluences', 'Lyon', 'Musée des Confluences', 'culture', 'Confluence', '€',
    'Musée de sciences et de sociétés, dans un bâtiment de verre et d’acier à la pointe de la presqu’île.',
    'On compare ses salles préférées en sortant, au bord du Rhône.'),
  a('a-lyon-halles', 'Lyon', 'Halles de Lyon Paul Bocuse', 'food', 'Part-Dieu', '€€',
    'Marché couvert de produits lyonnais : fromages, charcuteries, pâtisseries, comptoirs à huîtres.',
    'En partageant les assiettes, on goûte bien plus de choses.'),
  a('a-lyon-bouchon', 'Lyon', 'Dîner dans un bouchon lyonnais', 'food', 'Presqu’île', '€€',
    'Restaurant traditionnel lyonnais : quenelles, salade lyonnaise, tarte aux pralines.',
    'Les grandes tablées s’y prêtent : idéal pour un premier dîner de groupe.'),
  a('a-lyon-tete-or', 'Lyon', 'Parc de la Tête d’Or', 'plein-air', '6e arrondissement', 'gratuit',
    'Grand parc urbain avec lac, roseraie et grandes pelouses.',
    'Pique-nique et jeux de plein air : il faut être plusieurs.'),
  a('a-lyon-quais', 'Lyon', 'Soirée sur les quais du Rhône', 'nuit', 'Guillotière', '€',
    'Berges aménagées pour la promenade, avec des bars sur péniches le soir.',
    'Pour rentrer tard, mieux vaut ne pas être seul.'),

  // Paris
  a('a-paris-montmartre', 'Paris', 'Montmartre et le Sacré-Cœur', 'culture', 'Montmartre', 'gratuit',
    'Butte aux rues pavées, escaliers, vignes et panorama depuis le parvis de la basilique.',
    'On se perd volontiers dans les ruelles : à plusieurs, c’est une chasse aux points de vue.'),
  a('a-paris-louvre', 'Paris', 'Musée du Louvre', 'culture', '1er arrondissement', '€€',
    'L’un des plus grands musées du monde, des antiquités à la peinture européenne.',
    'Impossible de tout voir : chacun choisit une aile, on se raconte tout ensuite.'),
  a('a-paris-canal', 'Paris', 'Canal Saint-Martin', 'nuit', '10e arrondissement', 'gratuit',
    'Écluses, passerelles et quais où l’on s’assoit le soir.',
    'L’apéro au bord du canal, c’est forcément en groupe.'),
  a('a-paris-enfants-rouges', 'Paris', 'Marché des Enfants-Rouges', 'food', 'Le Marais', '€€',
    'Plus ancien marché couvert de Paris, avec des comptoirs de cuisines du monde.',
    'Chacun commande à un stand différent et on partage.'),
  a('a-paris-luxembourg', 'Paris', 'Jardin du Luxembourg', 'plein-air', '6e arrondissement', 'gratuit',
    'Jardin à la française avec bassin, terrasses et chaises en libre accès.',
    'Une pause à l’ombre entre deux visites, en refaisant le programme ensemble.'),
  a('a-paris-belleville', 'Paris', 'Street art à Belleville', 'culture', 'Belleville', 'gratuit',
    'Rues couvertes de fresques et vue sur Paris depuis le parc de Belleville.',
    'À plusieurs, on repère plus d’œuvres et on fait de meilleures photos.'),
  a('a-paris-seine-velo', 'Paris', 'Les berges de Seine à vélo', 'plein-air', 'Centre', '€',
    'Berges piétonnes le long de la Seine, entre l’Hôtel de Ville et la tour Eiffel.',
    'Une sortie à vélo se cale mieux en groupe, et on partage les arrêts photo.'),

  // Marrakech
  a('a-mkch-jemaa', 'Marrakech', 'Place Jemaa el-Fna', 'culture', 'Médina', 'gratuit',
    'Grande place de la médina, animée par les conteurs, musiciens et stands de nourriture le soir.',
    'La place est très animée le soir : on s’y sent plus à l’aise à plusieurs.'),
  a('a-mkch-majorelle', 'Marrakech', 'Jardin Majorelle', 'culture', 'Guéliz', '€€',
    'Jardin botanique aux bâtiments bleu outremer, avec un musée berbère.',
    'On y va tôt ensemble pour éviter la foule, puis café à Guéliz.'),
  a('a-mkch-souks', 'Marrakech', 'Les souks de la médina', 'culture', 'Médina', 'gratuit',
    'Dédale de ruelles marchandes : épices, cuir, céramiques, lanternes.',
    'Négocier à plusieurs, c’est plus drôle, et on se perd moins.'),
  a('a-mkch-bahia', 'Marrakech', 'Palais de la Bahia', 'culture', 'Mellah', '€',
    'Palais du XIXe siècle aux cours, zelliges et plafonds en cèdre peint.',
    'Visite tranquille à partager avant de repartir dans les ruelles.'),
  a('a-mkch-hammam', 'Marrakech', 'Hammam traditionnel', 'bien-etre', 'Médina', '€',
    'Bain de vapeur de quartier, avec gommage au savon noir.',
    'Une première fois se vit mieux accompagné, entre voyageurs du même genre.'),
  a('a-mkch-ourika', 'Marrakech', 'Excursion dans la vallée de l’Ourika', 'plein-air', 'Haut Atlas', '€€',
    'Vallée verdoyante au pied de l’Atlas, à une heure de route, avec cascades et villages berbères.',
    'Le transport se partage : à quatre, l’excursion coûte bien moins cher.'),
  a('a-mkch-cuisine-rue', 'Marrakech', 'Cuisine de rue à la tombée de la nuit', 'food', 'Médina', '€',
    'Stands de grillades, harira, escargots et thé à la menthe.',
    'On commande plusieurs plats pour la table et chacun goûte à tout.'),

  // Pristina
  a('a-pri-bibliotheque', 'Pristina', 'Bibliothèque nationale du Kosovo', 'culture', 'Centre', 'gratuit',
    'Bâtiment des années 1980 couvert de coupoles et d’un treillis métallique, souvent cité pour son architecture.',
    'L’architecture intrigue : on en discute volontiers ensemble.'),
  a('a-pri-newborn', 'Pristina', 'Monument Newborn', 'culture', 'Centre', 'gratuit',
    'Lettres géantes dévoilées lors de l’indépendance en 2008, repeintes chaque année.',
    'Photo de groupe incontournable.'),
  a('a-pri-boulevard', 'Pristina', 'Cafés du boulevard Mère-Teresa', 'food', 'Centre', '€',
    'Grande avenue piétonne bordée de cafés : la culture du macchiato y est très présente.',
    'Un café à plusieurs pour organiser la suite du voyage.'),
  a('a-pri-germia', 'Pristina', 'Parc de Gërmia', 'plein-air', 'Est de la ville', 'gratuit',
    'Grande forêt aux portes de la ville, avec sentiers de promenade.',
    'Les sentiers se parcourent plus sereinement en groupe.'),
  a('a-pri-ethno', 'Pristina', 'Musée ethnologique', 'culture', 'Vieille ville', '€',
    'Maison ottomane traditionnelle présentant la vie quotidienne et l’artisanat.',
    'Visite courte, parfaite pour lancer une journée ensemble.'),

  // Prizren
  a('a-prz-forteresse', 'Prizren', 'Forteresse de Prizren', 'culture', 'Vieille ville', 'gratuit',
    'Ruines perchées au-dessus de la ville, avec vue sur les toits et les minarets.',
    'On monte ensemble en fin de journée pour le coucher de soleil.'),
  a('a-prz-pont', 'Prizren', 'Pont de pierre et rives de la Bistrica', 'culture', 'Centre historique', 'gratuit',
    'Pont ottoman sur la rivière qui traverse la vieille ville.',
    'Point de rendez-vous idéal pour retrouver ses compagnons.'),
  a('a-prz-sinan', 'Prizren', 'Mosquée Sinan Pacha', 'culture', 'Centre historique', 'gratuit',
    'Mosquée du XVIIe siècle, l’un des monuments les plus visibles de la ville.',
    'Visite respectueuse et calme, à faire en petit groupe.'),
  a('a-prz-sharr', 'Prizren', 'Randonnée vers les monts Sharr', 'plein-air', 'Sud de la ville', 'gratuit',
    'Sentiers de moyenne montagne au départ de la vallée de la Bistrica.',
    'En montagne, on ne part jamais seul.'),
  a('a-prz-shadervan', 'Prizren', 'Terrasses de la place Shadërvan', 'food', 'Centre historique', '€',
    'Place pavée autour d’une fontaine, entourée de terrasses.',
    'Le soir, toute la ville s’y retrouve : facile de se joindre à une table.'),
]

export const activitesDe = (ville) => ACTIVITES.filter((x) => x.ville === ville)

// Une phrase de présentation pour l'en-tête du guide de ville.
export const RESUMES = {
  Lyon: 'Ville de gastronomie entre Rhône et Saône, dont le quartier Renaissance est classé au patrimoine mondial.',
  Paris: 'Des musées immenses, des quartiers aux airs de village et des soirées au bord de l’eau.',
  Marrakech: 'La ville rouge aux portes de l’Atlas : médina, souks, jardins et palais.',
  Pristina: 'Jeune capitale animée, connue pour ses cafés et son architecture singulière.',
  Prizren: 'Ville historique au pied des monts Sharr : forteresse, mosquées et pont ottoman.',
}
