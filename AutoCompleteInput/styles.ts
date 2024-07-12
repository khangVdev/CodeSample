import { colors, fonts, HEIGHT } from '@src/constants/vars';
import { StyleSheet } from 'react-native';
import { responsiveDistance } from '@constants/responsiveDistance';

export const styles = StyleSheet.create({
  container: {},
  dropdown: {
    position: 'absolute',
    backgroundColor: colors.WHITE,
    width: '100%',
    borderRadius: 4,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    borderColor: colors.BORDER_LINE,
    shadowOffset: { width: responsiveDistance.wp_3, height: responsiveDistance.hp_6 },
    elevation: 15,
    zIndex: 1,
  },
  containerList: {
    flex: 1,
    paddingHorizontal: responsiveDistance.wp_20,
  },
  maxHeight: {
    maxHeight: HEIGHT / 3,
  },
  txtEmpty: {
    color: colors.GREY_TWO,
    fontFamily: fonts.InterRegular,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
  },
  itemSeparator: {
    backgroundColor: colors.BORDER_LINE,
    height: responsiveDistance.hp_1,
  },
});
