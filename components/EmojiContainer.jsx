import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
} from 'emoji-picker-react'

const EmojiContainer = ({ handleEmojiClick }) => {
  return (
    <EmojiPicker
      onEmojiClick={handleEmojiClick}
      autoFocusSearch={false}
      theme={Theme.DARK}
      height={350}
      width='100%'
      lazyLoadEmojis={true}
      skinTonesDisabled
      defaultSkinTone={SkinTones.MEDIUM_LIGHT}
      emojiStyle={EmojiStyle.APPLE}
      categories={[
        {
          name: 'Smileys & People',
          category: Categories.SMILEYS_PEOPLE,
        },
        {
          name: 'Animals & Nature',
          category: Categories.ANIMALS_NATURE,
        },
        {
          name: 'Food & Drink',
          category: Categories.FOOD_DRINK,
        },
        {
          name: 'Travel & Places',
          category: Categories.TRAVEL_PLACES,
        },
        {
          name: 'Activities',
          category: Categories.ACTIVITIES,
        },
        {
          name: 'Objects',
          category: Categories.OBJECTS,
        },
        {
          name: 'Symbols',
          category: Categories.SYMBOLS,
        },
        {
          name: 'Flags',
          category: Categories.FLAGS,
        },
      ]}
    />
  )
}

export default EmojiContainer
