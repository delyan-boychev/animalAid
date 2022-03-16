export default function PageTitle(props) {
  const title = props.title;
  const pr = { ...props };
  delete pr.title;
  return (
    <div {...pr}>
      <h1 className="text-center text-primary fw-bold">{title}</h1>
      <hr className="ms-auto me-auto text-primary line"></hr>
    </div>
  );
}
