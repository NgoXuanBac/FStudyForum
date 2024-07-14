import { useSearchParams } from "react-router-dom";

const useSearchParam = <T extends string>({
  key,
  defaultValue
}: {
  key: string;
  defaultValue?: T;
}): [T, (value: T) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setter = (value: T) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(key, value as string);
    setSearchParams(newParams);
  };

  return [(searchParams.get(key) || defaultValue || "") as T, setter];
};

export default useSearchParam;
