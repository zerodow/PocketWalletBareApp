import { Dimensions, Platform } from 'react-native';

export const LANGUAGE_NAME = {
  EN: 'en',
  VI: 'vi',
};

export const DEFAULT_LIMIT = 20;

export const isIOS = Platform.OS === 'ios';

export const TIMEOUT_AUTO_FOCUS = 1000;

export const NONE_ERRORS = 'none';

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;

export const HEADER_HEIGHT = 55;

export const BOTTOM_SPACE = 30;

export const COMMON_SHEET_HEIGHT = deviceHeight * 0.85;

export const MIN_SHEET_HEIGHT = 200; // minimum height of bottom sheet

export const MAX_SHEET_HEIGHT = deviceHeight * 0.5; // maximum height of bottom sheet

export const Z_INDEX = {
  HEADER: 10,
  MODAL: 1000,
  LOADING: 10000,
  BOTTOM_SHEET: 10000,
  NETWORK: 100001,
};

export const DATE_FORMAT = 'D/M/YYYY';
