import * as React from 'react';
import * as PropTypes from 'prop-types';
import {Effect} from '@shopify/react-effect';

import hoistStatics from 'hoist-non-react-statics';

import I18n from './i18n';
import Connection from './connection';
import Manager, {ConnectionResult, ConnectionState} from './manager';
import {InvalidI18nConnectionError} from './errors';
import {TranslationDictionary, MaybePromise} from './types';
import {contextTypes} from './Provider';

type ReactComponent<P> = React.ComponentType<P>;

function getDisplayName(Component: ReactComponent<any>) {
  return (
    Component.displayName ||
    (Component as React.StatelessComponent<any>).name ||
    'Component'
  );
}

interface Context {
  i18nManager: Manager;
  i18nConnection?: Connection;
}

type TranslationGetter = (
  locale: string,
) => MaybePromise<TranslationDictionary | undefined>;

type TranslationMap = {
  [key: string]: MaybePromise<TranslationDictionary | undefined>;
};

export interface WithI18nOptions {
  id?: string;
  fallback?: TranslationDictionary;
  renderWhileLoading?: boolean;
  translations?: TranslationGetter | TranslationMap;
}

export interface WithI18nProps {
  i18n: I18n;
}

export interface State {
  loading: boolean;
  i18n: I18n;
}

const childContextTypes = {
  i18nConnection: PropTypes.instanceOf(Connection),
};

export function withI18n({id, fallback, translations}: WithI18nOptions = {}) {
  return function addI18n<OwnProps, C>(
    WrappedComponent: ReactComponent<OwnProps & WithI18nProps> & C,
  ): ReactComponent<OwnProps> & C {
    const name = id || getDisplayName(WrappedComponent);

    class WithTranslation extends React.Component<OwnProps, State> {
      static displayName = `withI18n(${name})`;
      static WrappedComponent = WrappedComponent;
      static contextTypes = {...contextTypes, ...childContextTypes};
      static childContextTypes = childContextTypes;

      private connection: Connection;
      private managerConnection: ConnectionResult;

      constructor(props: OwnProps, context: Context) {
        super(props, context);

        const {
          i18nManager: manager,
          i18nConnection: parentConnection,
        } = context;

        let connection: Connection;

        if (translations || fallback) {
          const connectionOptions = {
            id,
            fallback,
            translations:
              translations && normalizeTranslationGetter(translations),
          };

          connection = parentConnection
            ? parentConnection.extend(connectionOptions)
            : new Connection(connectionOptions);
        } else {
          if (parentConnection == null) {
            throw new InvalidI18nConnectionError(
              `Neither component ${name} nor its ancestors have any translations. Did you forget to include the \`translations\` or \`fallback\` options?`,
            );
          }

          connection = parentConnection;
        }

        this.connection = connection;

        this.managerConnection = manager.connect(
          connection,
          this.updateI18n.bind(this),
        );

        const connectionState = manager.state(connection);

        this.state = {
          loading: connectionState.loading,
          i18n: new I18n(connectionState.translations, manager.details),
        };
      }

      getChildContext() {
        return {i18nConnection: this.connection};
      }

      componentWillUnmount() {
        this.managerConnection.disconnect();
      }

      render() {
        const effectMarkup = this.state.loading ? (
          <Effect
            kind={this.context.i18nManager.effect}
            perform={() => this.managerConnection.resolve()}
          />
        ) : null;

        return (
          <>
            <WrappedComponent {...this.props} i18n={this.state.i18n} />
            {effectMarkup}
          </>
        );
      }

      private updateI18n(connectionState: ConnectionState) {
        this.setState({
          i18n: new I18n(
            connectionState.translations,
            this.context.i18nManager.details,
          ),
        });
      }
    }

    const FinalComponent = hoistStatics(
      WithTranslation,
      WrappedComponent as React.ComponentClass<any>,
    );
    return FinalComponent as React.ComponentClass<any> & C;
  };
}

function normalizeTranslationGetter(
  translations: TranslationMap | TranslationGetter,
) {
  return typeof translations === 'function'
    ? translations
    : (locale: string) => translations[locale];
}
