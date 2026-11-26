import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    PanelColorSettings,
    useSettings,
} from '@wordpress/block-editor';
import { Disabled, PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import ServerSideRender from '@wordpress/server-side-render';

// Types jamais proposés (mêmes exclusions que render.php)
const EXCLUDED_POST_TYPES = [
    'attachment',
    'wp_block',
    'wp_template',
    'wp_template_part',
    'wp_navigation',
];

// Anciens attributs de catégorie, propres au type (blocs d'avant la 1.1.0)
const LEGACY_CATEGORY = { page: 'pageCategory', post: 'postCategory' };
const legacyCategoryAttribute = (postType) => LEGACY_CATEGORY[postType] ?? 'adminCategory';

// Taxonomie de catégories : la première publique et hiérarchique, sinon la
// première publique (même règle que render.php)
function pickTaxonomy(taxonomies) {
    const candidates = (taxonomies ?? []).filter((tax) => tax.visibility?.public);
    return candidates.find((tax) => tax.hierarchical) ?? candidates[0] ?? null;
}

// Contraste avec le texte blanc des cartes (mêmes règles que render.php)
function contrastWithWhite(color) {
    let hex = String(color).replace('#', '');
    if (hex.length === 3) {
        hex = hex.replace(/./g, '$&$&');
    }
    if (!/^[0-9a-f]{6}$/i.test(hex)) {
        return 0;
    }

    const luminance = [0.2126, 0.7152, 0.0722].reduce((sum, weight, i) => {
        const channel = parseInt(hex.substr(i * 2, 2), 16) / 255;
        return (
            sum +
            weight *
                (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
        );
    }, 0);

    return 1.05 / (luminance + 0.05);
}

export default function Edit({ attributes, setAttributes }) {
    const { postType, postsToShow, backgroundColor } = attributes;

    // Palette du thème, limitée aux couleurs lisibles sous du texte blanc (AA)
    const [themePalette] = useSettings('color.palette.theme');
    const backgroundColors = (themePalette ?? []).filter(
        (color) => contrastWithWhite(color.color) >= 4.5
    );
    const currentBackground = backgroundColors.find((color) => color.slug === backgroundColor);
    const currentCategory =
        attributes.category || attributes[legacyCategoryAttribute(postType)] || 0;

    const { postTypeOptions, taxonomy, categories } = useSelect(
        (select) => {
            const { getPostTypes, getEntityRecords } = select(coreStore);

            const options = (getPostTypes({ per_page: -1 }) ?? [])
                .filter((type) => type.viewable && !EXCLUDED_POST_TYPES.includes(type.slug))
                .map((type) => ({ value: type.slug, label: type.name }));
            // Type enregistré mais absent du site : on le garde pour ne pas vider le menu
            if (!options.some((option) => option.value === postType)) {
                options.push({ value: postType, label: postType });
            }

            const tax = pickTaxonomy(
                getEntityRecords('root', 'taxonomy', { type: postType, per_page: -1 })
            );

            return {
                postTypeOptions: options,
                taxonomy: tax,
                categories: tax
                    ? getEntityRecords('taxonomy', tax.slug, { per_page: -1, _fields: 'id,name' })
                    : [],
            };
        },
        [postType]
    );

    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Réglages', 'ufo-tools-bento')}>
                    <SelectControl
                        __nextHasNoMarginBottom
                        label={__('Type de contenu', 'ufo-tools-bento')}
                        value={postType}
                        options={postTypeOptions}
                        onChange={(value) =>
                            setAttributes({
                                postType: value,
                                category: 0,
                                pageCategory: 0,
                                postCategory: 0,
                                adminCategory: 0,
                            })
                        }
                    />

                    {categories?.length > 0 && (
                        <SelectControl
                            __nextHasNoMarginBottom
                            label={taxonomy.labels?.singular_name ?? taxonomy.name}
                            value={currentCategory}
                            options={[
                                { value: 0, label: __('Toutes les catégories', 'ufo-tools-bento') },
                                ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
                            ]}
                            onChange={(value) =>
                                setAttributes({
                                    category: Number(value),
                                    [legacyCategoryAttribute(postType)]: 0,
                                })
                            }
                        />
                    )}

                    <RangeControl
                        __nextHasNoMarginBottom
                        label={__('Nombre d’éléments', 'ufo-tools-bento')}
                        help={__('Grille prévue pour 2 (une ligne) ou 5 (deux lignes).', 'ufo-tools-bento')}
                        value={postsToShow}
                        onChange={(value) => setAttributes({ postsToShow: value })}
                        min={1}
                        max={5}
                    />
                </PanelBody>

                <PanelColorSettings
                    title={__('Couleur', 'ufo-tools-bento')}
                    disableCustomColors
                    colorSettings={[
                        {
                            label: __('Fond et dégradé des cartes', 'ufo-tools-bento'),
                            colors: backgroundColors,
                            value: currentBackground?.color,
                            clearable: false,
                            onChange: (value) => {
                                const color = backgroundColors.find((c) => c.color === value);
                                if (color) {
                                    setAttributes({ backgroundColor: color.slug });
                                }
                            },
                        },
                    ]}
                >
                    <p className="components-base-control__help">
                        {__('Seules les couleurs du thème assez contrastées avec le texte blanc sont proposées.', 'ufo-tools-bento')}
                    </p>
                </PanelColorSettings>
            </InspectorControls>

            {/* Aperçu non interactif : les liens vers les contenus ne doivent pas
                être suivis depuis l'éditeur (comme le bloc core Derniers articles) */}
            <Disabled>
                <ServerSideRender
                    block="ufo-blocks/ufo-bento"
                    attributes={attributes}
                />
            </Disabled>
        </div>
    );
}
