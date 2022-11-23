import { OptionBase, Select } from 'chakra-react-select';
import { useCallback } from 'react';

import { chakra, FormControl } from '@chakra-ui/react';

import { useApi } from '../contexts';
import type { KeyringAddress, OrFalsy } from '../types';

import { Account } from './Account';

interface Props {
  id?: string;
  label?: React.ReactNode;
  onChange: (_: string) => void;
  value: OrFalsy<string>;
}

interface Option extends OptionBase {
  label: React.ReactNode;
  value: string;
}

function getOption(value: KeyringAddress): Option {
  return {
    label: <Account value={value.address} />,
    value: value.address,
  };
}

export function AccountSelect({
  id,
  label,
  onChange: _onChange,
  value,
}: Props) {
  const { accounts } = useApi();

  const options = accounts ? accounts.map(getOption) : [];
  const selected = options.find(
    ({ value: _value }) => _value === value.toString()
  );
  const onChange = useCallback(
    (o: Option) => {
      _onChange(o.value);
    },
    [_onChange]
  );

  return (
    <FormControl data-cy={id}>
      {label && (
        <chakra.label display="block" fontSize="sm" htmlFor={id} mb={2}>
          {label}
        </chakra.label>
      )}
      <Select<Option>
        chakraStyles={{
          valueContainer: (prev) => ({
            ...prev,
            pl: 2,
            py: 4,
          }),
        }}
        id={id}
        isSearchable={false}
        options={options}
        value={selected}
        onChange={onChange}
      />
    </FormControl>
  );
}

AccountSelect.defaultProps = {
  id: 'account-select',
  label: undefined,
};
