export default function PageTitle(props) {
  return (
    <div>
      <h1 className="text-center text-primary fw-bold">{props.title}</h1>
      <hr className="ms-auto me-auto text-primary line"></hr>
    </div>
  );
}
